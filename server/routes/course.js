const express = require("express");
const router = express.Router();
const Courses = require("../models/course");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

// Route to get all courses
router.get(
  "/",
  catchAsync(async (req, res) => {
    // Find all courses and populate the instructor field with specific attributes
    const courses = await Courses.find({}).populate(
      "instructor",
      "_id name averageRating",
    );

    // Send the list of courses as a response
    res.send(courses);
  }),
);

// Route to get a specific course by ID
router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // Find the course by ID and populate related fields
    const course = await Courses.findById(id)
      .populate("reviews")
      .populate("instructor", "_id name averageRating")
      .populate({
        path: "reviews",
        populate: {
          path: "author",
          select: "displayName",
        },
      });

    // If the course is not found, return a 404 error and throw an ExpressError
    if (!course) {
      res.status(404).json({ error: "Course not found" });
      throw new ExpressError("Course not found", 404);
    }

    // Send the found course as a response
    res.send(course);
  }),
);

module.exports = router;
