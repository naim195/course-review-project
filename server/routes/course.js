const express = require("express");
const router = express.Router();
const Courses = require("../models/course");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

router.get(
  "/",
  catchAsync(async (req, res) => {
    const courses = await Courses.find({});
    res.send(courses);
  }),
);

router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const course = await Courses.findById(id).populate("reviews");
    if (!course) {
      res.status(404).json({ error: "Course not found" });
      throw new ExpressError("Course not found", 404);      
    }
    res.send(course);
  }),
);

module.exports = router;
