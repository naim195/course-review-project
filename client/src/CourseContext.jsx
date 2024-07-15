import { createContext, useState, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [courseData, setCourseData] = useState({});
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [paginationInfo, setPaginationInfo] = useState({});
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchCourses = useCallback(
    async (params = {}) => {
      setLoading(true);
      try {
        const queryString = new URLSearchParams(params).toString();
        const response = await axios.get(
          `${backendUrl}/courses?${queryString}`,
        );
        const { courses, currentPage, totalPages, totalCourses } =
          response.data;
        setCourses(courses);
        setPaginationInfo({ currentPage, totalPages, totalCourses });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    },
    [backendUrl],
  );

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
        paginationInfo,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

CourseProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
