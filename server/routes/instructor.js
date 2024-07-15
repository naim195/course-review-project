const express = require("express");
const router = express.Router({ mergeParams: true });
const Instructor = require("../models/instructor");
const catchAsync = require("../utils/catchAsync");

// GET route to fetch paginated and sorted list of instructors
router.get(
  "/",
  catchAsync(async (req, res) => {
    // Use query parameters for pagination and sorting
    const page = parseInt(req.query.page) || 1; // Current page number (default to 1 if not provided)
    const limit = parseInt(req.query.limit) || 10; // Number of instructors per page (default to 10 if not provided)
    const sort = req.query.sort || "desc"; // Sort order for averageRating (default to descending if not provided)

    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    const totalInstructors = await Instructor.countDocuments(); // Count the total number of instructors in the database
    const totalPages = Math.ceil(totalInstructors / limit); // Calculate the total number of pages

    // Fetch the instructors with pagination and sorting
    const instructors = await Instructor.find({})
      .sort({ averageRating: sort }) // Sort by averageRating in the specified order
      .skip(skip) // Skip the calculated number of documents
      .limit(limit); // Limit the number of documents returned

    // Send the paginated and sorted list of instructors as the response
    res.json({
      instructors,
      currentPage: page,
      totalPages,
      totalInstructors,
    });
  })
);

module.exports = router;
