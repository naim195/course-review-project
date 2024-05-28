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
import { Controller, useForm } from "react-hook-form";

export default function Course() {
  const { courseId } = useParams();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      rating: 0,
      effortForGoodGrade: 0,
      overallDifficulty: 0,
      assignmentDifficulty: 0,
      examDifficulty: 0,
      textReview: "",
    },
  });

  const [courseData, setCourseData] = useState({});
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchCourseData(courseId);
  }, [courseId]);

  const fetchCourseData = async (courseId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/courses/${courseId}`,
      );
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

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/courses/${courseId}/reviews`,
        data,
      );
      setReviews((prev) => [...prev, response.data]);
      reset({
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
      await axios.delete(
        `http://localhost:3000/courses/${courseId}/reviews/${reviewId}`,
      );
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
        <Typography variant="h5" component="h2" gutterBottom>
          Reviews
        </Typography>
        {reviews.map((review, index) => (
          <div key={review._id || index}>
            <Typography variant="body2" gutterBottom>
              {review.textReview}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Overall Rating: {review.rating}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Effort for Good Grade: {review.effortForGoodGrade}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Overall Difficulty: {review.overallDifficulty}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Assignment Difficulty: {review.assignmentDifficulty}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Exam Difficulty: {review.examDifficulty}
            </Typography>
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography id="overallRating-slider" gutterBottom>
                    Overall Rating
                  </Typography>
                  <Controller
                    name="rating"
                    control={control}
                    rules={{ required: true, min: 0.5, max: 5 }}
                    render={({ field }) => (
                      <Rating
                        {...field}
                        precision={0.5}
                        value={field.value || 0}
                        onChange={(e, newValue) => field.onChange(newValue)}
                      />
                    )}
                  />
                  {errors.rating && (
                    <Typography color="error">
                      Overall Rating is required and must be between 0.5 and 5.
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Typography id="effortForGoodGrade-slider" gutterBottom>
                    Effort Required for Good Grade
                  </Typography>
                  <Controller
                    name="effortForGoodGrade"
                    control={control}
                    rules={{ required: true, min: 1, max: 5 }}
                    render={({ field }) => (
                      <Slider
                        {...field}
                        value={field.value || 0}
                        onChange={(_, newValue) => field.onChange(newValue)}
                        min={0}
                        max={5}
                        step={1}
                        marks
                        valueLabelDisplay="auto"
                      />
                    )}
                  />
                  {errors.effortForGoodGrade && (
                    <Typography color="error">
                      Effort Required for Good Grade is required and must be
                      between 1 and 5.
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Typography id="overallDifficulty-slider" gutterBottom>
                    Overall Difficulty
                  </Typography>
                  <Controller
                    name="overallDifficulty"
                    control={control}
                    rules={{ required: true, min: 1, max: 5 }}
                    render={({ field }) => (
                      <Slider
                        {...field}
                        value={field.value || 0}
                        onChange={(_, newValue) => field.onChange(newValue)}
                        min={0}
                        max={5}
                        step={1}
                        marks
                        valueLabelDisplay="auto"
                      />
                    )}
                  />
                  {errors.overallDifficulty && (
                    <Typography color="error">
                      Overall Difficulty is required and must be between 1 and
                      5.
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Typography id="assignmentDifficulty-slider" gutterBottom>
                    Assignment Difficulty
                  </Typography>
                  <Controller
                    name="assignmentDifficulty"
                    control={control}
                    rules={{ required: true, min: 1, max: 5 }}
                    render={({ field }) => (
                      <Slider
                        {...field}
                        value={field.value || 0}
                        onChange={(_, newValue) => field.onChange(newValue)}
                        min={0}
                        max={5}
                        step={1}
                        marks
                        valueLabelDisplay="auto"
                      />
                    )}
                  />
                  {errors.assignmentDifficulty && (
                    <Typography color="error">
                      Assignment Difficulty is required and must be between 1
                      and 5.
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Typography id="examDifficulty-slider" gutterBottom>
                    Exam Difficulty
                  </Typography>
                  <Controller
                    name="examDifficulty"
                    control={control}
                    rules={{ required: true, min: 1, max: 5 }}
                    render={({ field }) => (
                      <Slider
                        {...field}
                        value={field.value || 0}
                        onChange={(_, newValue) => field.onChange(newValue)}
                        min={0}
                        max={5}
                        step={1}
                        marks
                        valueLabelDisplay="auto"
                      />
                    )}
                  />
                  {errors.examDifficulty && (
                    <Typography color="error">
                      Exam Difficulty is required and must be between 1 and 5.
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Text Review"
                    name="textReview"
                    {...register("textReview", {
                      required: true,
                      minLength: 10,
                      maxLength: 1000,
                    })}
                    fullWidth
                    multiline
                    rows={4}
                  />
                  {errors.textReview && (
                    <Typography color="error">
                      Text Review is required and must be between 10 and 1000
                      characters.
                    </Typography>
                  )}
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
