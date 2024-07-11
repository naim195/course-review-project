import { Reviews } from "./Reviews";
import { ReviewForm } from "./ReviewForm";
import { Grid, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { CourseContext } from "../CourseContext";
import PropTypes from 'prop-types';

export function ReviewsSection({ user, courseId, courseData, reviews, setSnackbarOpen }) {
  const { setReviews } = useContext(CourseContext);
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
        ? courseData.instructor.map(instructor => ({
            rating: 0,
            name: instructor.name,
          }))
        : [],
      textReview: "",
      grade: "",
    },
  });

  const onSubmit = async (data) => {
    if (!user) {
      setSnackbarOpen(true);
      return;
    }

    try {
      const formattedInstructorRating = courseData.instructor.map(
        (instructor, index) => ({
          instructorId: instructor._id,
          rating: data.instructorRating[index].rating,
        })
      );

      const payload = {
        ...data,
        instructorRating: formattedInstructorRating,
        user,
      };

      const response = await axios.post(
        `${backendUrl}/courses/${courseId}/reviews`,
        payload,
        { withCredentials: true }
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
        { withCredentials: true }
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

  return (
    <Grid container spacing={4} justifyContent="center">
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
  );
}

ReviewsSection.propTypes = {
    user: PropTypes.object,
    courseId: PropTypes.string.isRequired,
    courseData: PropTypes.object.isRequired,
    reviews: PropTypes.arrayOf(PropTypes.object),
    setSnackbarOpen: PropTypes.func.isRequired,
  };
  