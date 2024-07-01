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
const { isLoggedIn } = require("../middleware/auth");

router.post(
  "/",
  isLoggedIn,
  validate(reviewSchema),
  catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const reviewData = req.body;

    const course = await Course.findById(courseId)
      .populate("reviews")
      .populate("instructor");
    const user = await User.findById(reviewData.user._id);

    if (!course) {
      throw new ExpressError("Course not found", 404);
    }

    const review = new Review({
      ...reviewData,
      author: reviewData.user._id,
    });

    course.reviews.push(review);
    user.reviews.push(review);

    await review.save();
    await course.save();
    await user.save();

    for (const instructorRating of reviewData.instructorRating) {
      const instructor = await Instructor.findById(
        instructorRating.instructorId,
      ); // Use instructorId instead of name
      if (instructor) {
        instructor.ratings.push(review);
        const ratings = await Review.find({ _id: { $in: instructor.ratings } });
        const totalRatings = ratings.reduce(
          (sum, r) =>
            sum +
            r.instructorRating.find((ir) =>
              ir.instructorId.equals(instructor._id),
            ).rating,
          0,
        );
        const averageRating =
          ratings.length > 0 ? totalRatings / ratings.length : 0;
        instructor.averageRating = averageRating;
        await instructor.save();
      }
    }

    res.status(201).json(review);
  }),
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { courseId, reviewId } = req.params;
    const course = await Course.findById(courseId);
    const review = await Review.findById(reviewId);

    if (!course) {
      throw new ExpressError("Course not found", 404);
    }

    if (!review) {
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
        instructorRating.instructorId,
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

    res.status(200).json({ message: "Review deleted successfully" });
  }),
);

module.exports = router;
