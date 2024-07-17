import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import { CourseContext } from "../CourseContext";
import SearchBar from "./SearchBar";
import TabsComponent from "./TabsComponent";
import SortFilterOptions from "./SortFilterOptions";

// component to display a list of courses with search, sort, filter
export default function CourseList() {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // getting course-related data and functions from context
  const {
    courses,
    fetchCourses,
    loading,
    sortBy,
    sortOrder,
    filters,
    handleSort,
    handleFilter,
  } = useContext(CourseContext);

  // fetch courses when component mounts or when dependencies change
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // update search term and category based on URL query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    if (category && search) {
      setSearchCategory(category);
      setSearchTerm(search);
    }
  }, [location.search]);

  // handle course card click
  const handleCardClick = (id) => {
    navigate(`/courses/${id}`);
  };

  // handle search input change
  const handleSearchChange = (event) => {
    if (searchCategory !== "") {
      setSearchTerm(event.target.value);
      setShowAlert(false);
      setActiveTab(0);
    } else {
      setShowAlert(true);
    }
  };

  // filter and sort courses based on search, filters, sorting criteria
  const filteredAndSortedCourses = courses
    ? courses
        .filter((course) => {
          // Filter by search term and category
          if (searchTerm === "") return true; // If no search term, include all courses
          if (searchCategory === "name")
            // Search in course name
            return course.name.toLowerCase().includes(searchTerm.toLowerCase());
          else if (searchCategory === "code")
            // Search in course code
            return course.code.toLowerCase().includes(searchTerm.toLowerCase());
          else if (searchCategory === "instructor")
            // Search in instructor names
            return course.instructor.some((instructor) =>
              instructor.name.toLowerCase().includes(searchTerm.toLowerCase()),
            );
          return true; // Include course if no category matches (failsafe)
        })
        .filter((course) => {
          // Filter by additional criteria (credits, ratings, difficulties)
          if (
            filters.credits.length > 0 &&
            !filters.credits.includes(course.credits)
          )
            return false; // Exclude if credits don't match
          if (
            filters.avgRating !== null &&
            course.avgRating < filters.avgRating
          )
            return false; // Exclude if rating is too low
          if (
            filters.avgOverallDifficulty !== null &&
            course.avgOverallDifficulty > filters.avgOverallDifficulty
          )
            return false; // Exclude if too difficult
          if (
            filters.avgEffortForGoodGrade !== null &&
            course.avgEffortForGoodGrade > filters.avgEffortForGoodGrade
          )
            return false; // Exclude if requires too much effort
          if (
            filters.isBeingOffered !== null &&
            course.isBeingOffered !== filters.isBeingOffered
          )
            return false;
          return true; // Include course if it passes all filters
        })
        // Sort courses based on sortBy and sortOrder
        .sort((a, b) => {
          // If 'a' should come first in ascending order, return -1; otherwise 1
          if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1;
          // If 'b' should come first in ascending order, return 1; otherwise -1

          if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1;
          return 0; // If values are equal, keep original order
        })
    : []; // if courses is null/undefined, return an empty array

  // Group filtered and sorted courses by category
  const groupedCourses = filteredAndSortedCourses.reduce((acc, course) => {
    const category = course.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(course);
    return acc;
  }, {});

  const tabHeaders = Object.keys(groupedCourses); // Array of category headers for tabs

  // Display loading indicator while courses are being fetched
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

  // Render course list with search, sorting, filtering, and tab navigation
  return (
    <Box sx={{ mx: 4, marginTop: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        All Courses
      </Typography>
      {/* Search bar component */}
      <SearchBar
        searchCategory={searchCategory}
        setSearchCategory={setSearchCategory}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        showAlert={showAlert}
      />
      {/* Sort and filter options component */}
      <SortFilterOptions
        sortBy={sortBy}
        sortOrder={sortOrder}
        filters={filters}
        handleSort={handleSort}
        handleFilter={handleFilter}
      />
      {/* Tabs component for course categories */}
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
