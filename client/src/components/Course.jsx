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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";

export default function Course() {
  const { courseId } = useParams();
  const location = useLocation();

  const user = location.state?.user;

  const [courseData, setCourseData] = useState({});
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
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
      instructorRating: courseData.instructor
        ? courseData.instructor.map((instructor) => ({
            rating: 0,
            name: instructor.name,
          }))
        : [],
      examDifficulty: 0,
      textReview: "",
      grade: "",
    },
  });

  const fetchCourseData = useCallback(async (courseId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/courses/${courseId}`,
      );
      if (response.status === 200) {
        setCourseData(response.data);
        setReviews(response.data.reviews || []);
      } else {
        console.log("error in if else upper");
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.log(error);
      setError(
        error.response?.data?.error ||
          "An error occurred while fetching course data",
      );
      setCourseData({});
      setReviews([]);
    }
  }, []);

  useEffect(() => {
    fetchCourseData(courseId);
  }, [courseId, fetchCourseData]);

  const onSubmit = async (data) => {
    try {
      const formattedInstructorRating = courseData.instructor.map(
        (instructor, index) => ({
          name: instructor.name,
          rating: data.instructorRating[index].rating,
        }),
      );

      const payload = {
        ...data,
        instructorRating: formattedInstructorRating,
        user,
      };

      const response = await axios.post(
        `http://localhost:3000/courses/${courseId}/reviews`,
        payload,
        { withCredentials: true },
      );
      setReviews((prev) => [...prev, response.data]);
      reset({
        rating: 0,
        effortForGoodGrade: 0,
        overallDifficulty: 0,
        instructorRating: courseData.instructor.map(() => ({
          rating: 0,
          name: "",
        })),
        examDifficulty: 0,
        textReview: "",
        grade: "",
      });
    } catch (error) {
      console.log(error);
      setError(
        error.response?.data?.error ||
          "An error occurred while submitting the review",
      );
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(
        `http://localhost:3000/courses/${courseId}/reviews/${reviewId}`,
        { withCredentials: true },
      );
      setReviews((prev) => prev.filter((review) => review._id !== reviewId));
    } catch (error) {
      console.error("Error deleting review", error);
    }
  };

  const hasUserReviewedBefore = () => {
    if (user) return reviews.some((review) => review.author === user._id);
  };

  const instructorNames =
    courseData && courseData.instructor
      ? courseData.instructor.map((instructor) => instructor.name).join(", ")
      : "";

  return (
    <Container maxWidth="md">
      {error ? (
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      ) : (
        <>
          <Box my={4}>
            <Paper elevation={3} className="p-6">
              <Box>
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
                    <Typography variant="body2">{instructorNames}</Typography>
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
              <div key={review._id || index} className="mb-4">
                <Typography variant="body2" gutterBottom>
                  {review.textReview}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <Rating value={review.rating} precision={0.5} readOnly />
                </Typography>
                {/* <Typography variant="body2" gutterBottom>
                  Effort for Good Grade: {review.effortForGoodGrade}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Overall Difficulty: {review.overallDifficulty}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Instructor Rating: {review.instructorRating}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Exam Difficulty: {review.examDifficulty}
                </Typography> */}
                {user && review.author === user._id && (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(review._id)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            ))}
          </div>
          {!hasUserReviewedBefore() && (
            <Box my={4}>
              <Paper elevation={3} className="p-6">
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
                          <Slider
                            {...field}
                            value={field.value || 0}
                            onChange={(_, newValue) => field.onChange(newValue)}
                            min={0}
                            max={5}
                            step={0.5}
                            marks
                            valueLabelDisplay="auto"
                            className="mb-2"
                          />
                        )}
                      />
                      {errors.rating && (
                        <Typography color="error">
                          Overall Rating is required and must be between 0.5 and
                          5.
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
                            className="mb-2"
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
                            className="mb-2"
                          />
                        )}
                      />
                      {errors.overallDifficulty && (
                        <Typography color="error">
                          Overall Difficulty is required and must be between 1
                          and 5.
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <Typography id="instructorRating-slider" gutterBottom>
                        Instructor Rating
                      </Typography>
                      {courseData.instructor &&
                        courseData.instructor.map((instructor, index) => (
                          <div key={instructor._id || index}>
                            <Typography>{instructor.name}</Typography>
                            <Controller
                              name={`instructorRating.${index}.rating`}
                              control={control}
                              rules={{ required: true, min: 1, max: 5 }}
                              render={({ field }) => (
                                <Slider
                                  {...field}
                                  value={field.value || 0}
                                  onChange={(_, newValue) =>
                                    field.onChange(newValue)
                                  }
                                  min={0}
                                  max={5}
                                  step={1}
                                  marks
                                  valueLabelDisplay="auto"
                                  className="mb-2"
                                />
                              )}
                            />
                            {errors.instructorRating &&
                              errors.instructorRating[index]?.rating && (
                                <Typography color="error">
                                  Instructor Rating for {instructor.name} is
                                  required and must be between 1 and 5.
                                </Typography>
                              )}
                            <Controller
                              name={`instructorRating.${index}.name`}
                              control={control}
                              defaultValue={instructor.name}
                              render={({ field }) => (
                                <TextField {...field} type="hidden" />
                              )}
                            />
                          </div>
                        ))}
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
                            className="mb-2"
                          />
                        )}
                      />
                      {errors.examDifficulty && (
                        <Typography color="error">
                          Exam Difficulty is required and must be between 1 and
                          5.
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">Grade</FormLabel>
                        <Controller
                          name="grade"
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <RadioGroup {...field} row>
                              {["A", "A-", "B", "B-", "C", "C-", "D", "E"].map(
                                (grade) => (
                                  <FormControlLabel
                                    key={grade}
                                    value={grade}
                                    control={<Radio />}
                                    label={grade}
                                  />
                                ),
                              )}
                            </RadioGroup>
                          )}
                        />
                        {errors.grade && (
                          <Typography color="error">
                            Grade is required.
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Text Review (optional)"
                        name="textReview"
                        {...register("textReview", {
                          minLength: 5,
                          maxLength: 1000,
                        })}
                        fullWidth
                        multiline
                        rows={4}
                        className="mb-2"
                      />
                      {errors.textReview && (
                        <Typography color="error">
                          Text Review must be between 5 and 1000 characters.
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
              </Paper>
            </Box>
          )}
        </>
      )}
    </Container>
  );
}
