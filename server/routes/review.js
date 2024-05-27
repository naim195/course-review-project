const express = require('express');
const router = express.Router({mergeParams:true});
const Review = require('../models/reviews');
const Course = require('../models/course');

router.post('/', async (req, res) => {
    try {
        const { courseId } = req.params;
        const reviewData = req.body;
        const course = await Course.findById(courseId);
        const review = new Review(reviewData);
        course.reviews.push(review);
        await review.save();
        await course.save();        
        console.log('review added succesfully');
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
