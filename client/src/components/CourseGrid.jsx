import { Box } from "@mui/material";
import PropTypes from "prop-types";
import CourseCard from "./CourseCard";

function CourseGrid({ courses, handleCardClick }) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
      }}
    >
      {courses.map((course) => (
        <CourseCard key={course._id} course={course} handleCardClick={handleCardClick} />
      ))}
    </Box>
  );
}

CourseGrid.propTypes = {
  courses: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleCardClick: PropTypes.func.isRequired,
};

export default CourseGrid;
