const express = require("express");
const router = express.Router();
const Courses = require("../models/course");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

// GET route to get all the courses (for the main page)
router.get(
  "/",
  catchAsync(async (req, res) => {
<<<<<<< Updated upstream
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
=======
    // Fetch all courses and populate the instructor field with name, avg rating and id(the one give by MongoDB )
    const courses = await Courses.find({}).populate(
      "instructor",
      "_id name averageRating"
    );

    // Send the list of courses as the response
    res.send(courses);
  })
>>>>>>> Stashed changes
);

// GET route to fetch a particular course by ID
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

    // Send the course details as the response
    res.send(course);
  })
);

module.exports = router;
