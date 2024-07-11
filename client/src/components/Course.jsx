import { CourseData } from "./IndividualCourseData";
import { ReviewsSection } from "./ReviewsSection";
import { CourseStatistics } from "./CourseStatistics";
import { AuthContext } from "../AuthContext";
import { CourseContext } from "../CourseContext";
import { Container, Typography, Snackbar, Alert } from "@mui/material";
import { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";

export default function Course() {
  const { courseId } = useParams();
  const { user } = useContext(AuthContext);
  const { courseData, fetchCourseData, reviews, error } = useContext(CourseContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    fetchCourseData(courseId);
  }, [courseId, fetchCourseData]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const instructorNames = courseData?.instructor
    ?.map(instructor => `${instructor.name}${instructor.averageRating ? `(${instructor.averageRating.toFixed(2)})` : ""}`)
    .join(", ") || "";

  return (
    <Container maxWidth="lg" sx={{ mb: 4 }}>
      {error ? (
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      ) : (
        <>
          <CourseData instructorNames={instructorNames} courseData={courseData} />
          <CourseStatistics reviews={reviews} />
          <ReviewsSection
            user={user}
            courseId={courseId}
            courseData={courseData}
            reviews={reviews}
            setSnackbarOpen={setSnackbarOpen}
          />
        </>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="warning" sx={{ width: '100%' }}>
          Please sign in to submit a review.
        </Alert>
      </Snackbar>
    </Container>
  );
}
