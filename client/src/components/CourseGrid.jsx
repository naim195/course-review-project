import { Box } from "@mui/material";
import PropTypes from "prop-types";
import CourseCard from "./CourseCard";

function CourseGrid({ courses, handleCardClick }) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: {
          xs: "repeat(auto-fill, minmax(280px, 1fr))",
          sm: "repeat(auto-fill, minmax(300px, 1fr))",
          md: "repeat(auto-fill, minmax(320px, 1fr))",
        },
        justifyContent: "center",
      }}
    >
      {courses.map((course) => (
        <CourseCard
          key={course._id}
          course={course}
          handleCardClick={handleCardClick}
        />
      ))}
    </Box>
  );
}

CourseGrid.propTypes = {
  courses: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleCardClick: PropTypes.func.isRequired,
};

export default CourseGrid;