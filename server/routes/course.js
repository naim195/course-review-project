const express = require("express");
const router = express.Router();
const Courses = require("../models/course");

router.get("/", async (req, res) => {
  const courses = await Courses.find({});
  res.send(courses);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const course = await Courses.findById(id);
  res.send(course);
})

module.exports = router;