import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from "@mui/material";

CourseList.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      instructor: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
        }),
      ).isRequired,
      category: PropTypes.string.isRequired,
    }),
  ).isRequired,
  setCourses: PropTypes.func.isRequired,
  user: PropTypes.object,
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function CourseList({ courses, setCourses, user }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const fetchCourses = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/courses");
      const coursesData = response.data;
      setCourses(coursesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [setCourses]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleCardClick = (id) => {
    navigate(`/courses/${id}`, { state: { user } });
  };

  const handleSearchChange = (event) => {
    if (searchCategory !== "") {
      setSearchTerm(event.target.value);
      setShowAlert(false);
      setActiveTab(0);
    } else {
      setShowAlert(true);
    }
  };

  const filteredCourses = courses
    ? courses.filter((course) => {
        if (searchTerm === "") return true;
        if (searchCategory === "name")
          return course.name.toLowerCase().includes(searchTerm.toLowerCase());
        else if (searchCategory === "code")
          return course.code.toLowerCase().includes(searchTerm.toLowerCase());
        else if (searchCategory === "instructor")
          return course.instructor.some((instructor) =>
            instructor.name.toLowerCase().includes(searchTerm.toLowerCase()),
          );
        return true;
      })
    : [];

  const groupedCourses = filteredCourses.reduce((acc, course) => {
    const category = course.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(course);
    return acc;
  }, {});

  const tabHeaders = Object.keys(groupedCourses);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mx: 4, marginTop: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        All Courses
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <TextField
          label="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          onClick={(e) => e.stopPropagation()}
          variant="outlined"
          fullWidth
        />
        <TextField
          select
          label="Select Category"
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          variant="outlined"
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Select Category</MenuItem>
          <MenuItem value="code">Course Code</MenuItem>
          <MenuItem value="name">Course Name</MenuItem>
          <MenuItem value="instructor">Instructor</MenuItem>
        </TextField>
      </Box>
      {showAlert && (
        <Alert severity="error" sx={{ mb: 4 }}>
          Please select a category before searching.
        </Alert>
      )}
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={activeTab}
          onChange={(event, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="course tabs"
        >
          {tabHeaders.map((tabHeader, index) => (
            <Tab key={index} label={tabHeader} />
          ))}
        </Tabs>
        {tabHeaders.map((tabHeader, index) => (
          <TabPanel key={index} value={activeTab} index={index}>
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              }}
            >
              {groupedCourses[tabHeader].map((course) => (
                <Card
                  key={course._id}
                  sx={{
                    cursor: "pointer",
                    transition: "box-shadow 0.3s",
                    "&:hover": { boxShadow: 6 },
                  }}
                  onClick={() => handleCardClick(course._id)}
                >
                  <CardContent>
                    <Typography
                      variant="h5"
                      component="div"
                      color="error.main"
                      gutterBottom
                      sx={{ fontWeight: "medium" }}
                    >
                      {course.code}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      component="div"
                      gutterBottom
                    >
                      {course.name}
                    </Typography>
                    <Typography variant="body2">
                      {course.instructor
                        .map((instructor) => instructor.name)
                        .join(", ")}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </TabPanel>
        ))}
      </Box>
    </Box>
  );
}
