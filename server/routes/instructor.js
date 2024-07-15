const express = require("express");
const router = express.Router({ mergeParams: true });
const Instructor = require("../models/instructor");
const catchAsync = require("../utils/catchAsync");

// GET route for fetching instructors with pagination and sorting
router.get(
  "/",
  catchAsync(async (req, res) => {
    // parse query parameters for pagination and sorting

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "desc";

    //pages to skip for pagination
    const skip = (page - 1) * limit;

    //total count of instructors for pagination info
    const totalInstructors = await Instructor.countDocuments();
    const totalPages = Math.ceil(totalInstructors / limit);

    //fetch the instructors from the database with sorting, skipping, and limiting
    const instructors = await Instructor.find({})
      .sort({ averageRating: sort })
      .skip(skip)
      .limit(limit);

    //send response with fetched instructors and pagination details
    res.json({
      instructors,
      currentPage: page,
      totalPages,
      totalInstructors,
    });
  }),
);

module.exports = router;
