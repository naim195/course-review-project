import { CourseData } from "./IndividualCourseData";
import { Reviews } from "./Reviews";
import { ReviewForm } from "./ReviewForm";
import { AuthContext } from "../AuthContext";
import { CourseContext } from "../CourseContext";
import { Box, Grid, Paper, Typography, Container } from "@mui/material";
import axios from "axios";
import { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { BarChart } from "@mui/x-charts/BarChart";

export default function Course() {
  const { courseId } = useParams();
  const { user } = useContext(AuthContext);
  const { courseData, fetchCourseData, reviews, setReviews, error } =
    useContext(CourseContext);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

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
        `${backendUrl}/courses/${courseId}/reviews`,
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
        `${backendUrl}/courses/${courseId}/reviews/${reviewId}`,
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
            return `${instructor.name}${
              instructor.averageRating
                ? `(${instructor.averageRating.toFixed(2)})`
                : ""
            }`;
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
    <Container maxWidth="lg" sx={{ mb: 4 }}>
      {error ? (
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      ) : (
        <>
          <CourseData
            instructorNames={instructorNames}
            courseData={courseData}
          />

          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h2" gutterBottom>
                Course Statistics
              </Typography>
              {reviews.length > 0 ? (
                <Box sx={{ height: 400, width: "100%" }}>
                  <BarChart
                    xAxis={[
                      { scaleType: "band", data: graphData.map((it) => it.x) },
                    ]}
                    series={[{ data: graphData.map((it) => it.y) }]}
                    height={400}
                  />
                </Box>
              ) : (
                <Typography variant="body1">No reviews yet.</Typography>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h2" gutterBottom>
                Reviews
              </Typography>
              {reviews.length > 0 ? (
                <Reviews
                  reviews={reviews}
                  user={user}
                  handleDelete={handleDelete}
                />
              ) : (
                <Typography variant="body1">No reviews yet.</Typography>
              )}
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              {!hasUserReviewedBefore() ? (
                <>
                  <Typography variant="h4" component="h2" gutterBottom>
                    Add a Review
                  </Typography>
                  <Paper elevation={3} sx={{ padding: "24px", margin: "auto" }}>
                    <ReviewForm
                      handleSubmit={handleSubmit}
                      onSubmit={onSubmit}
                      control={control}
                      errors={errors}
                      register={register}
                      courseData={courseData}
                    />
                  </Paper>
                </>
              ) : (
                <Typography variant="body1">
                  You have already submitted a review for this course.
                </Typography>
              )}
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
}
