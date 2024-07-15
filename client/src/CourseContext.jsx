import { createContext, useState, useCallback, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [courseData, setCourseData] = useState({});
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filters, setFilters] = useState({
    credits: [],
    avgRating: null,
    avgOverallDifficulty: null,
    avgEffortForGoodGrade: null,
  });
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Load persisted state from localStorage
  useEffect(() => {
    const savedSortBy = localStorage.getItem("sortBy");
    const savedSortOrder = localStorage.getItem("sortOrder");
    const savedFilters = localStorage.getItem("filters");

    if (savedSortBy) setSortBy(savedSortBy);
    if (savedSortOrder) setSortOrder(savedSortOrder);
    if (savedFilters) setFilters(JSON.parse(savedFilters));
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("sortBy", sortBy);
    localStorage.setItem("sortOrder", sortOrder);
    localStorage.setItem("filters", JSON.stringify(filters));
  }, [sortBy, sortOrder, filters]);

  const fetchCourses = useCallback(async () => {
    if (courses.length === 0) {
      setLoading(true);
      try {
        const response = await axios.get(`${backendUrl}/courses`);
        const coursesData = response.data;
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    }
  }, [courses.length, backendUrl]);

  const fetchCourseData = useCallback(
    async (courseId) => {
      try {
        const response = await axios.get(`${backendUrl}/courses/${courseId}`);
        if (response.status === 200) {
          setCourseData(response.data);
          setReviews(response.data.reviews || []);
        } else {
          throw new Error(response.data.error);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
        setError(
          error.response?.data?.error ||
            "An error occurred while fetching course data",
        );
        setCourseData({});
        setReviews([]);
      }
    },
    [backendUrl],
  );

  const handleSort = useCallback(
    (type, value) => {
      if (type === "sortBy") {
        setSortBy(value);
        if (sortBy === value) {
          setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
        } else {
          setSortOrder("asc");
        }
      } else if (type === "sortOrder") {
        setSortOrder(value);
      }
    },
    [sortBy],
  );

  const handleFilter = useCallback((filterType, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  }, []);

  return (
    <CourseContext.Provider
      value={{
        courses,
        courseData,
        fetchCourses,
        fetchCourseData,
        loading,
        reviews,
        setReviews,
        error,
        sortBy,
        sortOrder,
        filters,
        handleSort,
        handleFilter,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

CourseProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
