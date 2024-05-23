const mongoose = require("mongoose");
const courseList = require("../seeds/coursesList");
const Course = require("../models/course");

mongoose.connect("mongodb://127.0.0.1:27017/coursereview");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "conection error"));
db.once("open", () => {
  console.log("Database connected");
});

const seedDb = async () => {
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

      const course = new Course({
        name: indCourse["Course Name"],
        code: indCourse["Course Code"],
        instructor: instructors,
      });
      await course.save();
    }
  }
};

seedDb();
