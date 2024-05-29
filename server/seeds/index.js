const mongoose = require("mongoose");
const courseList = require("../seeds/coursesList");
const Course = require("../models/course");

mongoose.connect("mongodb://127.0.0.1:27017/coursereview");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "conection error"));
db.once("open", () => {
  console.log("Database connected");
});

const courseCategoryMap = {
  CL: "core-cl",
  CE: "core-ce",
  EE: "core-ee",
  MSE: "core-mse",
  CS: "core-cs",
  ME: "core-me",
  HS: "humanities",
  MS: "management",
  ES: "es-misc",
};

const getCourseCategory = (courseCode, courseName) => {
  if (courseName.toLowerCase().includes("science basket")) {
    return "science-basket";
  }
  if (courseName.toLowerCase().includes("mathematics basket")) {
    return "maths-basket";
  }
  const matchingCategory = Object.entries(courseCategoryMap).find(([prefix]) =>
    courseCode.includes(prefix),
  );
  return matchingCategory ? matchingCategory[1] : "misc";
};

const seedDb = async () => {
  let courseCategory = "";

  await Course.deleteMany({});

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
