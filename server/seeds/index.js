const mongoose = require("mongoose");
const courseList = require("../seeds/coursesList");
const Course = require("../models/course");
const Review = require("../models/reviews");
const User = require("../models/user");

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
  let courseCategory = "";

  await Course.deleteMany({});
  await User.deleteMany({});
  await Review.deleteMany({});

  for (const indCourse of courseList) {
    if (
      indCourse["Course Code"] &&
      "Course Name" in indCourse &&
      indCourse["Course Name"] &&
      "Instructor" in indCourse
    ) {
      const instructors = indCourse.Instructor.split(",")
        .filter((s) => s.includes("(I") || s.includes("(L"))
        .map((s) => s.trim());

      courseCategory = getCourseCategory(
        indCourse["Course Code"],
        indCourse["Course Name"],
      );

      const course = new Course({
        name: indCourse["Course Name"],
        code: indCourse["Course Code"],
        instructor: instructors,
        category: courseCategory,
      });

      await course.save();
    }
  }
};

seedDb();
