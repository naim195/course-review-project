import axios from "axios";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { red } from "@mui/material/colors";
import { CardActionArea } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CourseList({ courses, setCourses }) {
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:3000/courses");
      const coursesData = response.data;
      setCourses(coursesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/courses/${id}`);
  };

  return (
    <>
      <h1>All Courses</h1>
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={course._id}>
            <Card sx={{ minWidth: 275, marginBottom: 2 }}>
              <CardActionArea onClick={() => handleCardClick(course._id)}>
                <CardContent>
                  <Typography variant="h4" align="left" sx={{ color: "red" }}>
                    {course.code}
                  </Typography>
                  <Typography variant="h6">{course.name}</Typography>
                  <Typography variant="body2">{course.instructor}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
