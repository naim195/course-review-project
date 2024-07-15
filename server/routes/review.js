const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/reviews");
const Course = require("../models/course");
const User = require("../models/user");
const Instructor = require("../models/instructor");
const { reviewSchema } = require("../schemas");
const validate = require("../middleware/validate");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn } = require("../middleware/checkAuth");

// Function to update course averages after adding or removing a review
async function updateCourseAverages(courseId) {
  const course = await Course.findById(courseId).populate("reviews");

  if (!course || !course.reviews.length) {
    // If no course or reviews, set averages to 0
    course.avgOverallDifficulty = 0;
    course.avgEffortForGoodGrade = 0;
    course.avgRating = 0;
  } else {
    const reviewCount = course.reviews.length;
    let totalOverallDifficulty = 0;
    let totalEffortForGoodGrade = 0;
    let totalRating = 0;

    // Sum up the review metrics
    course.reviews.forEach((review) => {
      totalOverallDifficulty += review.overallDifficulty;
      totalEffortForGoodGrade += review.effortForGoodGrade;
      totalRating += review.rating;
    });

    // Calculate the averages
    course.avgOverallDifficulty = totalOverallDifficulty / reviewCount;
    course.avgEffortForGoodGrade = totalEffortForGoodGrade / reviewCount;
    course.avgRating = totalRating / reviewCount;
  }

  // Save the updated course document
  await course.save();
}

// POST route to add a new review
router.post(
  "/",
  isLoggedIn, // Middleware to check if the user is logged in
  validate(reviewSchema), // Middleware to validate the review data against the schema
  catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const reviewData = req.body;

    const course = await Course.findById(courseId)
      .populate("reviews")
      .populate("instructor");
    const user = await User.findById(reviewData.user._id);

    if (!course) {
      // If course is not found, throw an error
      throw new ExpressError("Course not found", 404);
    }

    // Create a new review and associate it with the user
    const review = new Review({
      ...reviewData,
      author: reviewData.user._id,
    });

    // Add the review to the course and user
    course.reviews.push(review);
    user.reviews.push(review);

    // Save the review, course, and user
    await review.save();
    await course.save();
    await user.save();

    // Update instructor ratings based on the review
    for (const instructorRating of reviewData.instructorRating) {
      const instructor = await Instructor.findById(
        instructorRating.instructorId
      ); // Use instructorId instead of name
      if (instructor) {
        instructor.ratings.push(review);
        const ratings = await Review.find({ _id: { $in: instructor.ratings } });
        const totalRatings = ratings.reduce(
          (sum, r) =>
            sum +
            r.instructorRating.find((ir) =>
              ir.instructorId.equals(instructor._id)
            ).rating,
          0
        );
        const averageRating =
          ratings.length > 0 ? totalRatings / ratings.length : 0;
        instructor.averageRating = averageRating;
        await instructor.save();
      }
    }

    // Update the course averages
    await updateCourseAverages(courseId);

    // Send the created review as the response
    res.status(201).json(review);
  })
);

// DELETE route to remove a review
router.delete(
  "/:reviewId",
  isLoggedIn, // Middleware to check if the user is logged in
  catchAsync(async (req, res) => {
    const { courseId, reviewId } = req.params;
    const course = await Course.findById(courseId);
    const review = await Review.findById(reviewId);

    if (!course) {
      // If course is not found, throw an error
      throw new ExpressError("Course not found", 404);
    }

    if (!review) {
      // If review is not found, throw an error
      throw new ExpressError("Review not found", 404);
    }

    // Remove review from course and user
    await Course.findByIdAndUpdate(courseId, { $pull: { reviews: reviewId } });
    await User.findByIdAndUpdate(review.author, {
      $pull: { reviews: reviewId },
    });

    // Remove review from instructors and update average rating
    for (const instructorRating of review.instructorRating) {
      const instructor = await Instructor.findById(
        instructorRating.instructorId
      ); // Use instructorId instead of name
      if (instructor) {
        await Instructor.findByIdAndUpdate(instructor._id, {
          $pull: { ratings: reviewId },
        });

        // Recalculate average rating
        const previousTotalRatings =
          instructor.averageRating * instructor.ratings.length;
        const updatedTotalRatings =
          previousTotalRatings - instructorRating.rating;
        const updatedRatingsCount = instructor.ratings.length - 1;
        const newAverageRating =
          updatedRatingsCount > 0
            ? updatedTotalRatings / updatedRatingsCount
            : 0;

        instructor.averageRating = newAverageRating;
        await instructor.save();
      }
    }

    // Delete the review
    await Review.findByIdAndDelete(reviewId);
    await updateCourseAverages(courseId);

    // Send success message as the response
    res.status(200).json({ message: "Review deleted successfully" });
  })
);

module.exports = router;
