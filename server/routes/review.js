const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/reviews");
const Course = require("../models/course");
const { reviewSchema } = require("../schemas");
const validate = require("../middleware/validate");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { isAuthenticated } = require("../middleware/auth");

router.post(
  "/",
  isAuthenticated,
  validate(reviewSchema),
  catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const reviewData = req.body;
    const course = await Course.findById(courseId).populate("reviews");

    if (!course) {
      throw new ExpressError("Course not found", 404);
    }
    const review = new Review({
      ...reviewData,
      author: req.user._id,
    });
    course.reviews.push(review);
    await review.save();
    await course.save();
    res.status(201).json(review); //gives response to frontend
    console.log("review added succesfully");
  }),
);

router.delete(
  "/:reviewId",
  isAuthenticated,
  catchAsync(async (req, res) => {
    const { courseId, reviewId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      throw new ExpressError("Course not found", 404);
    }

    await Course.findByIdAndUpdate(courseId, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.status(200).json({ message: "Review deleted successfully" });
  }),
);

module.exports = router;
