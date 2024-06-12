import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Tabs, Tab, Box, Typography } from "@mui/material";

CourseList.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      instructor: PropTypes.arrayOf(PropTypes.string).isRequired,
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
    navigate(`/courses/${id}`, { state: { user } });
  };

  const handleSearchChange = (event) => {
    if (searchCategory !== "") {
      setSearchTerm(event.target.value);
      setShowAlert(false);
      setActiveTab(0); // Reset to the first tab on search
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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="mx-8">
      <h1 className="text-3xl font-bold mb-4">All Courses</h1>
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          onClick={(e) => e.stopPropagation()}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        />
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        >
          <option value="">Select Category</option>
          <option value="code">Course Code</option>
          <option value="name">Course Name</option>
        </select>
      </div>
      {showAlert && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          Please select a category before searching.
        </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {groupedCourses[tabHeader].map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                  onClick={() => handleCardClick(course._id)}
                >
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-red-600 mb-2">
                      {course.code}
                    </h3>
                    <h4 className="text-lg font-medium mb-2">{course.name}</h4>
                    <p className="text-gray-600">
                      {course.instructor.join(", ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabPanel>
        ))}
      </Box>
    </div>
  );
}
