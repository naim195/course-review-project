import { Box, Card, CardContent, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Course() {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState({});

  const fetchCourseData = async (courseId) => {
    try {
      const response = await axios.get(`http://localhost:3000/courses/${courseId}`);
      const data = response.data;
      setCourseData(data);
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  useEffect(() => {
    fetchCourseData(courseId);
  }, [courseId]);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom>
            {courseData.name}
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            {courseData.code}
          </Typography>
          <Typography variant="body1">Instructor: {courseData.instructor}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}