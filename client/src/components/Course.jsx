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
  const [reviews, setReviews] = useState([]);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    effortForGoodGrade: 0,
    overallDifficulty: 0,
    assignmentDifficulty: 0,
    examDifficulty: 0,
    textReview: "",
  });

  useEffect(() => {
    fetchCourseData(courseId);
  }, [courseId]);

  const fetchCourseData = async (courseId) => {
    try {
      const response = await axios.get(`http://localhost:3000/courses/${courseId}`);
      setCourseData(response.data);
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSliderChange = (name) => (event, newValue) => {
    setReviewData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:3000/courses/${courseId}/reviews`, reviewData);
      setReviews((prev) => [...prev, response.data]);
      setReviewData({
        rating: 0,
        effortForGoodGrade: 0,
        overallDifficulty: 0,
        assignmentDifficulty: 0,
        examDifficulty: 0,
        textReview: "",
      });
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:3000/courses/${courseId}/reviews/${reviewId}`);
      setReviews((prev) => prev.filter((review) => review._id !== reviewId));
    } catch (error) {
      console.error("Error deleting review", error);
    }
  };

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
        <Typography variant="h5" component="h2" gutterBottom>Reviews</Typography>
        {reviews.map((review, index) => (
          <div key={review._id || index}>
            <Typography variant="body2" gutterBottom>{review.textReview}</Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleDelete(review._id)}
            >
              Delete
            </Button>
          </div>
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
                    name="rating"
                    value={reviewData.rating}
                    onChange={(e, newValue) => handleSliderChange("rating")(e, newValue)}
                    precision={0.5}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography id="effortForGoodGrade-slider" gutterBottom>
                    Effort Required for Good Grade
                  </Typography>
                  <Slider
                    name="effortForGoodGrade"
                    value={reviewData.effortForGoodGrade}
                    onChange={handleSliderChange("effortForGoodGrade")}
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
                    name="overallDifficulty"
                    value={reviewData.overallDifficulty}
                    onChange={handleSliderChange("overallDifficulty")}
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
                    name="assignmentDifficulty"
                    value={reviewData.assignmentDifficulty}
                    onChange={handleSliderChange("assignmentDifficulty")}
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
                    name="examDifficulty"
                    value={reviewData.examDifficulty}
                    onChange={handleSliderChange("examDifficulty")}
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
