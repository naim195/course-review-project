import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import { CourseContext } from "../CourseContext";
import SearchBar from "./SearchBar";
import TabsComponent from "./TabsComponent";

export default function CourseList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { courses, fetchCourses, loading } = useContext(CourseContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    if (category && search) {
      setSearchCategory(category);
      setSearchTerm(search);
    }
  }, [location.search]);

  const handleCardClick = (id) => {
    navigate(`/courses/${id}`);
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
            instructor.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      <SearchBar
        searchCategory={searchCategory}
        setSearchCategory={setSearchCategory}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        showAlert={showAlert}
      />
      <TabsComponent
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabHeaders={tabHeaders}
        groupedCourses={groupedCourses}
        handleCardClick={handleCardClick}
      />
    </Box>
  );
}
