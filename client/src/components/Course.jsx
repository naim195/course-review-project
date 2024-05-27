import {
  Box,
  Grid,
  Paper,
  Typography,
  Container,
  TextField,
  Button,
  Rating,
  Slider,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Course() {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState({});
  const [reviewData, setReviewData] = useState({
    rating: "",
    effortForGoodGrade: "",
    overallDifficulty: "",
    assignmentDifficulty: "",
    examDifficulty: "",
    textReview: "",
  });

  const fetchCourseData = async (courseId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/courses/${courseId}`,
      );
      const data = response.data;
      setCourseData(data);
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  const handleChange = (e) => {
    setReviewData({
      ...reviewData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:3000/courses/${courseId}/reviews`,
        reviewData,
      );
      console.log("Review submitted successfully");
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  useEffect(() => {
    fetchCourseData(courseId);
  }, [courseId]);

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Paper elevation={3}>
          <Box p={3}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h4" component="h1" gutterBottom>
                  {courseData.name}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  {courseData.code}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Instructor: {courseData.instructor}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
      <div>
        <div>Reviews</div>
        {courseData.reviews &&
          courseData.reviews.map((review, index) => (
            <div key={index}>{review.textReview}</div>
          ))}
      </div>
      <Box my={4}>
        <Paper elevation={3}>
          <Box p={3}>
            <Typography variant="h5" component="h2" gutterBottom>
              Add a Review
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography id="overallRating-slider" gutterBottom>
                    Overall Rating
                  </Typography>
                  <Rating
                    label="Rating"
                    name="rating"
                    value={reviewData.rating}
                    onChange={handleChange}
                    precision={0.5}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography id="effortForGoodGrade-slider" gutterBottom>
                    Effort Required for Good Grade
                  </Typography>
                  <Slider
                    label="Effort for Good Grade"
                    name="effortForGoodGrade"
                    value={reviewData.effortForGoodGrade}
                    onChange={handleChange}
                    min={0}
                    max={5}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography id="overallDifficulty-slider" gutterBottom>
                    Overall Difficulty
                  </Typography>
                  <Slider
                    label="Overall Difficulty"
                    name="overallDifficulty"
                    value={reviewData.overallDifficulty}
                    onChange={handleChange}
                    min={0}
                    max={5}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography id="assignmentDifficulty-slider" gutterBottom>
                    Assignment Difficulty
                  </Typography>
                  <Slider
                    label="Assignment Difficulty"
                    name="assignmentDifficulty"
                    value={reviewData.assignmentDifficulty}
                    onChange={handleChange}
                    min={0}
                    max={5}
                    step={1}
                    marks
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography id="examDifficulty-slider" gutterBottom>
                    Exam Difficulty
                  </Typography>
                  <Slider
                    label="Exam Difficulty"
                    name="examDifficulty"
                    value={reviewData.examDifficulty}
                    onChange={handleChange}
                    min={0}
                    max={5}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Text Review"
                    name="textReview"
                    value={reviewData.textReview}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" color="primary" type="submit">
                    Submit Review
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
