import {
  Box,
  Grid,
  Paper,
  Typography,
  Container,
  Button,
  Rating,
} from "@mui/material";
import axios from "axios";
import { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ReviewForm } from "./ReviewForm";
import { BarChart } from "@mui/x-charts/BarChart";
import { AuthContext } from "../AuthContext";
import { CourseContext } from "../CourseContext";

export default function Course() {
  const { courseId } = useParams();
  const { user } = useContext(AuthContext);
  const { courseData, fetchCourseData, reviews, setReviews, error } =
    useContext(CourseContext);

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
      textReview: "",
      grade: "",
    },
  });

  useEffect(() => {
    fetchCourseData(courseId);
  }, [courseId, fetchCourseData]);

  const onSubmit = async (data) => {
    try {
      const formattedInstructorRating = courseData.instructor.map(
        (instructor, index) => ({
          instructorId: instructor._id,
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
          instructorId: "",
        })),
        textReview: "",
        grade: "",
      });
    } catch (error) {
      console.error("Error submitting review:", error);
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
    if (user) {
      return reviews.some((review) => review.author._id === user._id);
    }
    return false;
  };

  const instructorNames =
    courseData && courseData.instructor
      ? courseData.instructor
          .map((instructor) => {
            return `${instructor.name}${instructor.averageRating ? `(${instructor.averageRating.toFixed(2)})` : ""}`;
          })
          .join(", ")
      : "";

  let gradeFreqMap = {
    A: 0,
    "A-": 0,
    B: 0,
    "B-": 0,
    C: 0,
    "C-": 0,
    D: 0,
    E: 0,
  };

  reviews.forEach((review) => {
    const grade = review.grade;
    gradeFreqMap[grade]++;
  });

  let graphData = [];

  for (const [grade, freq] of Object.entries(gradeFreqMap)) {
    graphData.push({ x: grade, y: freq });
  }

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
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      {courseData.credits}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2">{instructorNames}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      Avg Rating: {courseData.avgRating}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      Avg Effort for Good Grade:{" "}
                      {courseData.avgEffortForGoodGrade}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      Avg Overall Difficulty: {courseData.avgOverallDifficulty}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
            {reviews.length > 0 && (
              <BarChart
                xAxis={[
                  { scaleType: "band", data: graphData.map((it) => it.x) },
                ]}
                series={[{ data: graphData.map((it) => it.y) }]}
                width={600}
                height={400}
              />
            )}
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
                <Typography variant="body2" gutterBottom>
                  {review.author ? review.author.displayName : "Anonymous"}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Effort for Good Grade: {review.effortForGoodGrade}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Overall Difficulty: {review.overallDifficulty}
                </Typography>

                {user && review.author._id === user._id && (
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
                <ReviewForm
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  control={control}
                  errors={errors}
                  register={register}
                  courseData={courseData}
                />
              </Paper>
            </Box>
          )}
        </>
      )}
    </Container>
  );
}
