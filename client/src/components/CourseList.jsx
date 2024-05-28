import axios from "axios";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {
  CardActionArea,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CourseList({ courses, setCourses }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

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

  const handleSearchChange = (event) => {
    if (searchCategory !== "") {
      setSearchTerm(event.target.value);
    } else {
      alert("Please select a category before searching.");
    }
  };

  const filteredCourses = courses.filter((course) => {
    if (searchTerm === "") return true;
    if (searchCategory === "name")
      return course.name.toLowerCase().includes(searchTerm.toLowerCase());
    else if (searchCategory === "code")
      return course.code.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <h1>All Courses</h1>
      <TextField
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
        onClick={(e) => e.stopPropagation()}
      />
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="search-options">Search by</InputLabel>
        <Select
          label="Search by"
          labelId="search-options"
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
        >
          <MenuItem value={""}>Select Category</MenuItem>
          <MenuItem value={"code"}>Course Code</MenuItem>
          <MenuItem value={"name"}>Course Name</MenuItem>
        </Select>
      </FormControl>
      <Grid container spacing={3}>
        {filteredCourses.map((course) => (
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
