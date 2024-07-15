const express = require("express");
const router = express.Router();
const Courses = require("../models/course");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

router.get(
  "/",
  catchAsync(async (req, res) => {
    const { page = 1, limit = 20, category, search } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
        { "instructor.name": { $regex: search, $options: "i" } },
      ];
    }

    const courses = await Courses.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("instructor", "_id name averageRating");

    const total = await Courses.countDocuments(filter);

    res.json({
      courses,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalCourses: total,
    });
  }),
);

router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
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

    if (!course) {
      res.status(404).json({ error: "Course not found" });
      throw new ExpressError("Course not found", 404);
    }
    res.send(course);
  }),
);

module.exports = router;
