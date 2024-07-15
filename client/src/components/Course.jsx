import { CourseData } from "./IndividualCourseData";
import { ReviewsSection } from "./ReviewsSection";
import { CourseStatistics } from "./CourseStatistics";
import { AuthContext } from "../AuthContext";
import { CourseContext } from "../CourseContext";
import { Container, Typography, Snackbar, Alert } from "@mui/material";
import { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";

export default function Course() {
  const { courseId } = useParams(); //course ID from parameters
  const { user } = useContext(AuthContext); //user data
  const { courseData, fetchCourseData, reviews, error } =
    useContext(CourseContext); //course data
  const [snackbarOpen, setSnackbarOpen] = useState(false); //managing snackbar visibility

  //Fetching course data on component mount or when courseId changes
  useEffect(() => {
    fetchCourseData(courseId);
  }, [courseId, fetchCourseData]);

  //closing snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  //instructor names like: name1(rating),name2(rating)
  const instructorNames =
    courseData?.instructor
      ?.map(
        (instructor) =>
          `${instructor.name}${instructor.averageRating ? `(${instructor.averageRating.toFixed(2)})` : ""}`,
      )
      .join(", ") || "";

  return (
    <Container maxWidth="lg" sx={{ mb: 4 }}>
      {error ? ( //display error message if there's an error fetching course data
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      ) : (
        <>
          {/* to display course data */}
          <CourseData
            instructorNames={instructorNames}
            courseData={courseData}
          />
          {/* to display course statistics */}
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
        autoHideDuration={6000} //hide snackbar after 6s
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} //snackbar position
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="warning"
          sx={{ width: "100%" }}
        >
          Please sign in to submit a review.
        </Alert>
      </Snackbar>
    </Container>
  );
}
