const express = require("express");
const router = express.Router({ mergeParams: true });
const Instructor = require("../models/instructor");
const catchAsync = require("../utils/catchAsync");

router.get(
  "/",
  catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "desc";

    const skip = (page - 1) * limit;

    const totalInstructors = await Instructor.countDocuments();
    const totalPages = Math.ceil(totalInstructors / limit);

    const instructors = await Instructor.find({})
      .sort({ averageRating: sort })
      .skip(skip)
      .limit(limit);

    res.json({
      instructors,
      currentPage: page,
      totalPages,
      totalInstructors,
    });
  }),
);

module.exports = router;
