const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/reviews");
const Course = require("../models/course");

router.post("/", async (req, res) => {
  try {
    const { courseId } = req.params;
    const reviewData = req.body;
    const course = await Course.findById(courseId).populate("reviews");
    const review = new Review(reviewData);
    course.reviews.push(review);
    await review.save();
    await course.save();
    res.status(201).json(review); //gives response to frontend
    console.log("review added succesfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:reviewId", async (req, res) => {
  const { id, reviewId } = req.params;
  Course.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.status(200).json({ message: "Review deleted successfully" });
});

module.exports = router;
