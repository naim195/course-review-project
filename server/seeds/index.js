const mongoose = require("mongoose");
const Course = require("../models/course");
const Review = require("../models/reviews");
const User = require("../models/user");
const Instructor = require("../models/instructor");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library");
const dotenv = require("dotenv");
const { faker } = require("@faker-js/faker/locale/en_IN");

dotenv.config();

// Set up MongoDB connection
const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

// course categories
const scienceBasket = {
  "PH 201": "Introduction to Electrodynamics",
  "PH 202": "Introduction to Quantum Physics",
  "PH 404": "Molecular and Crystal Physics",
  "PH 503": "Quantum Mechanics I",
  "PH 505": "Classical Electrodynamics",
  "PH 507": "Statistical Mechanics",
  "PH 508": "Classical Mechanics",
  "PH 509": "Computational Physics",
  "PH 510": "Condensed Matter Physics",
  "CH 203": "Fundamentals and Applications of Spectroscopy",
  "CH 204": "Organic Chemistry in Everyday Life",
  "CH 302": "Electrochemical Science and Engineering",
  "CH 401": "Food Chemistry",
  "CH 511": "Quantum Chemistry",
  "CG 503": "Fundamentals of Cognitive Psychology",
  "CG 505": "Fundamental Neuroscience",
  "EH 605": "Modeling of Earth System and Sustainability",
  "EH 608": "Biodiversity Conservation and Sustainable Development",
  "EH 303": "Introduction to Earth Sciences",
  "EH 612": "Ocean and Global Change",
  "EH 602": "River Morphology and Ecology",
  "EH 304": "Drone Data Acquisition Processing and Interpretation",
};

const mathsBasket = {
  "MA 204": "Introduction to Partial Differential Equations",
  "MA 205": "Calculus of Several Variables",
  "MA 206": "Introduction to Complex Analysis",
};
const courseCodeDict = [
  "BE",
  "BS",
  "CE",
  "CG",
  "CH",
  "CL",
  "CS",
  "DES",
  "EE",
  "EH",
  "ES",
  "FP",
  "GE",
  "HS",
  "IN",
  "MA",
  "ME",
  "MS",
  "MSE",
  "PH",
];

// Initialize auth for google sheets
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Replace escaped newlines
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const doc = new GoogleSpreadsheet(
  process.env.GOOGLE_SHEET_ID,
  serviceAccountAuth,
);

// Function to determine course category
const getCourseCategory = (courseCode, courseName) => {
  if (scienceBasket.hasOwnProperty(courseCode)) {
    return "Sci. Basket";
  }
  if (mathsBasket.hasOwnProperty(courseCode)) {
    return "Maths Basket";
  }
  const code = courseCode.split(" ")[0];
  if (courseCodeDict.includes(code)) return code;
  return "Misc";
};

// Function to generate fake reviews
const generateFakeReviews = async () => {
  const courses = await Course.find();
  let users = await User.find();

  if (users.length === 0) {
    console.log("No users found. Creating sample users.");
    for (let i = 0; i < 10; i++) {
      const sampleUser = new User({
        googleId: faker.string.uuid(),
        displayName: faker.person.fullName(),
        email: faker.internet.email(),
      });
      await sampleUser.save();
      users.push(sampleUser);
    }
  }

  for (const course of courses) {
    const numberOfReviews = faker.number.int({ min: 1, max: 20 }); // 1 to 20 reviews per course

    for (let i = 0; i < numberOfReviews; i++) {
      const user = faker.helpers.arrayElement(users);

      const instructorRatings = course.instructor.map((instructor) => ({
        instructorId: instructor._id,
        rating: faker.number.int({ min: 1, max: 5 }),
      }));

      const review = new Review({
        rating: faker.number.int({ min: 1, max: 5 }),
        effortForGoodGrade: faker.number.int({ min: 1, max: 5 }),
        overallDifficulty: faker.number.int({ min: 1, max: 5 }),
        instructorRating: instructorRatings,
        grade: faker.helpers.arrayElement([
          "A",
          "A-",
          "B",
          "B-",
          "C",
          "C-",
          "D",
          "E",
        ]),
        textReview: faker.lorem.sentence(), // Generate a sentence instead of a paragraph
        author: user._id,
      });

      await review.save();

      course.reviews.push(review._id);
      user.reviews.push(review._id);

      await course.save();
      await user.save();

      // Update instructor ratings
      for (const instructorRating of instructorRatings) {
        const instructor = await Instructor.findById(
          instructorRating.instructorId,
        );
        instructor.ratings.push(review._id);

        // Recalculate the average rating
        const instructorReviews = await Review.find({
          "instructorRating.instructorId": instructor._id,
        });
        const totalRating = instructorReviews.reduce((sum, review) => {
          const rating = review.instructorRating.find((r) =>
            r.instructorId.equals(instructor._id),
          ).rating;
          return sum + rating;
        }, 0);
        instructor.averageRating =
          instructorReviews.length > 0
            ? totalRating / instructorReviews.length
            : 0;

        await instructor.save();
      }
    }

    // Update course averages
    const courseReviews = await Review.find({ _id: { $in: course.reviews } });
    course.avgOverallDifficulty =
      courseReviews.reduce((sum, review) => sum + review.overallDifficulty, 0) /
      courseReviews.length;
    course.avgEffortForGoodGrade =
      courseReviews.reduce(
        (sum, review) => sum + review.effortForGoodGrade,
        0,
      ) / courseReviews.length;
    course.avgRating =
      courseReviews.reduce((sum, review) => sum + review.rating, 0) /
      courseReviews.length;

    await course.save();
  }

  console.log("Fake reviews generated successfully");
};

//main function to seed database
const seedDb = async () => {
  try {
    // Clear existing data
    await Course.deleteMany({});
    await Review.deleteMany({});
    await User.deleteMany({});
    await Instructor.deleteMany({});

    // Load Google Sheet info
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle["Time table"];

    const rows = await sheet.getRows();

    //create courses and instructors
    for (const row of rows) {
      const courseCode = row.get("Course Code");
      const courseName = row.get("Course Name");
      const credits = row.get("C");
      const instructor = row.get("Instructor");
      const lecture = row.get("Lecture");
      const tutorial = row.get("Tutorial");
      const lab = row.get("Lab");

      if (courseCode && courseName && instructor) {
        //process instructor names
        const instructorNames = instructor
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.includes("(I") || s.includes("(L"))
          .map((s) => {
            const index = s.indexOf("(");
            return index !== -1 ? s.substring(0, index).trim() : s;
          });

        const courseCategory = getCourseCategory(courseCode, courseName);

        const instructors = [];

        // Create instructors and add them to the course
        for (const name of instructorNames) {
          // Create or find instructors
          let instructor = await Instructor.findOne({ name: name });

          if (!instructor) {
            instructor = new Instructor({
              name: name,
            });
            await instructor.save();
          }

          instructors.push(instructor);
        }

        //create new course
        const course = new Course({
          name: courseName,
          code: courseCode,
          category: courseCategory,
          credits: credits,
          instructor: instructors, // Assign array of instructors
        });

        await course.save();
      }
    }
    console.log("Courses and instructors seeded successfully");

    // Generate fake reviews after seeding courses
    await generateFakeReviews();

    console.log("Database seeding completed successfully");
    process.exit(0); // Exit the script after seeding
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1); // Exit with error
  }
};

//run seeding function
seedDb();
