import axios from "axios";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {
  Alert,
  CardActionArea,
  CircularProgress,
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
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const categoryToDisplayName = {
    "core-ce": "Civil Engg. Core Courses",
    "core-cl": "Chemical Engg. Core Courses",
    "core-cs": "Computer Science & Engg. Core Courses",
    "core-me": "Mechanical Engg Core Courses",
    "core-mse": "Materials Science & Engg Core Courses",
    "core-ee": "Electrical Engg Core Courses",
    humanities: "Humanities Courses",
    management: "Management Courses",
    "maths-basket": "Mathematics Basket",
    "science-basket": "Science Basket",
    "es-misc": "ES Courses",
    misc: "Other Courses",
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:3000/courses");
      const coursesData = response.data;
      setCourses(coursesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
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
      setShowAlert(false);
    } else {
      setShowAlert(true);
    }
  };

  const filteredCourses = courses.filter((course) => {
    if (searchTerm === "") return true;
    if (searchCategory === "name")
      return course.name.toLowerCase().includes(searchTerm.toLowerCase());
    else if (searchCategory === "code")
      return course.code.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const groupedCourses = filteredCourses.reduce((acc, course) => {
    const category = course.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(course);
    return acc;
  }, {});

  if (loading) {
    return <CircularProgress />;
  }

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
      {showAlert && (
        <Alert severity="error" variant="outlined">
          Please select a category before searching.
        </Alert>
      )}

      {Object.keys(groupedCourses).map((category) => (
        <div key={category}>
          <h2>{categoryToDisplayName[category]}</h2>
          <Grid container spacing={3}>
            {groupedCourses[category].map((course) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={course._id}>
                <Card sx={{ minWidth: 275, marginBottom: 2 }}>
                  <CardActionArea onClick={() => handleCardClick(course._id)}>
                    <CardContent>
                      <Typography
                        variant="h4"
                        align="left"
                        sx={{ color: "red" }}
                      >
                        {course.code}
                      </Typography>
                      <Typography variant="h6">{course.name}</Typography>
                      <Typography variant="body2">
                        {course.instructor.join(",")}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      ))}
    </>
  );
}
