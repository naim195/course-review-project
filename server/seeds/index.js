const mongoose = require("mongoose");
const courseList = require("../seeds/coursesList");
const Course = require("../models/course");
const Review = require("../models/reviews");
const User = require("../models/user");
const Instructor = require("../models/instructor");

mongoose.connect("mongodb://127.0.0.1:27017/coursereview");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "conection error"));
db.once("open", () => {
  console.log("Database connected");
});

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

const seedDb = async () => {
  try {
    await Course.deleteMany({});
    await User.deleteMany({});
    await Review.deleteMany({});
    await Instructor.deleteMany({});

    for (const indCourse of courseList) {
      if (
        indCourse["Course Code"] &&
        "Course Name" in indCourse &&
        indCourse["Course Name"] &&
        "Instructor" in indCourse
      ) {
        const instructorNames = indCourse.Instructor.split(",")
          .map((s) => s.trim())
          .filter((s) => s.includes("(I") || s.includes("(L"))
          .map((s) => {
            const index = s.indexOf("(");
            return index !== -1 ? s.substring(0, index).trim() : s;
          });

        const courseCategory = getCourseCategory(
          indCourse["Course Code"],
          indCourse["Course Name"],
        );

        const instructors = [];

        // Create instructors and add them to the course
        for (const name of instructorNames) {
          let instructor = await Instructor.findOne({ name: name });

          if (!instructor) {
            instructor = new Instructor({
              name: name,
            });
            await instructor.save();
          }

          instructors.push(instructor);
        }

        const course = new Course({
          name: indCourse["Course Name"],
          code: indCourse["Course Code"],
          category: courseCategory,
          instructor: instructors, // Assign array of instructors
        });

        await course.save();
      }
    }

    console.log("Database seeding completed successfully");
    process.exit(0); // Exit the script after seeding
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1); // Exit with error
  }
};

seedDb();
