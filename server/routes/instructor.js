const express = require("express");
const router = express.Router({ mergeParams: true });
const Instructor = require('../models/instructor');
const catchAsync = require("../utils/catchAsync");

router.get('/', catchAsync(async(req, res) => {
    const instructors = await Instructor.find({});
    res.send(instructors);
}))

module.exports = router;