import { Card, CardContent, Typography } from "@mui/material";
import PropTypes from "prop-types";

function CourseCard({ course, handleCardClick }) {
  return (
    <Card
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
        <Typography variant="subtitle1" component="div" gutterBottom>
          {course.name}
        </Typography>
        <Typography variant="body2">
          {course.instructor.map((instructor) => instructor.name).join(", ")}
        </Typography>
      </CardContent>
    </Card>
  );
}

CourseCard.propTypes = {
  course: PropTypes.object.isRequired,
  handleCardClick: PropTypes.func.isRequired,
};

export default CourseCard;
