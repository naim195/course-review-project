import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { CourseContext } from "../CourseContext";
import SearchBar from "./SearchBar";
import TabsComponent from "./TabsComponent";

export default function CourseList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { courses, fetchCourses, loading, paginationInfo } =
    useContext(CourseContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [difficultyFilter, setDifficultyFilter] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = searchParams.get("page") || 1;

    fetchCourses({ category, search, page });

    if (category && search) {
      setSearchCategory(category);
      setSearchTerm(search);
    }
  }, [location.search, fetchCourses]);

  const handleCardClick = (id) => {
    navigate(`/courses/${id}`);
  };

  const handleSearchChange = (event) => {
    if (searchCategory !== "") {
      setSearchTerm(event.target.value);
      setShowAlert(false);
      setActiveTab(0);
      fetchCourses({
        category: searchCategory,
        search: event.target.value,
        page: 1,
      });
    } else {
      setShowAlert(true);
    }
  };

  const handlePageChange = (event, value) => {
    fetchCourses({ category: searchCategory, search: searchTerm, page: value });
  };

  const handleSortChange = (event) => {
    setSortField(event.target.value);
  };

  const handleSortOrderChange = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleDifficultyFilterChange = (event) => {
    setDifficultyFilter(event.target.value);
  };

  const sortedAndFilteredCourses = courses
    .filter((course) =>
      difficultyFilter ? course.avgOverallDifficulty <= difficultyFilter : true,
    )
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const groupedCourses = sortedAndFilteredCourses.reduce((acc, course) => {
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FormControl sx={{ minWidth: 120, mr: 2 }}>
            <InputLabel>Sort By</InputLabel>
            <Select value={sortField} onChange={handleSortChange}>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="code">Code</MenuItem>
              <MenuItem value="avgRating">Rating</MenuItem>
              <MenuItem value="avgOverallDifficulty">Difficulty</MenuItem>
            </Select>
          </FormControl>
          <Button
            onClick={handleSortOrderChange}
            startIcon={
              sortOrder === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />
            }
          >
            {sortOrder === "asc" ? "Ascending" : "Descending"}
          </Button>
        </Box>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Difficulty</InputLabel>
          <Select
            value={difficultyFilter}
            onChange={handleDifficultyFilterChange}
          >
            <MenuItem value={null}>All</MenuItem>
            <MenuItem value={3}>Easy (≤3)</MenuItem>
            <MenuItem value={4}>Medium (≤4)</MenuItem>
            <MenuItem value={5}>Hard (≤5)</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <TabsComponent
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabHeaders={tabHeaders}
        groupedCourses={groupedCourses}
        handleCardClick={handleCardClick}
      />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={paginationInfo.totalPages}
          page={paginationInfo.currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
}
