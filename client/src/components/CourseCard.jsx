import { Card, CardContent, Typography, Grid, Box, Rating } from "@mui/material";
import PropTypes from "prop-types";

function CourseCard({ course, handleCardClick }) {
  return (
    <Card
      sx={{
        cursor: "pointer",
        transition: "box-shadow 0.3s",
        "&:hover": { boxShadow: 6 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minWidth: '280px',
        maxWidth: '400px',
      }}
      onClick={() => handleCardClick(course._id)}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: 2 }}>
        <Box sx={{ mb: 2, flex: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography
              variant="h6"
              component="div"
              color="error.main"
              gutterBottom
              sx={{ fontWeight: "medium", wordBreak: "break-word" }}
            >
              {course.code}
            </Typography>
            <Rating value={course.avgRating} readOnly size="small" precision={0.1} />
          </Box>
          <Typography 
            variant="subtitle1" 
            component="div" 
            gutterBottom
            sx={{ wordBreak: "break-word" }}
          >
            {course.name}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ mb: 1, wordBreak: "break-word" }}
          >
            {course.instructor.map((instructor) => instructor.name).join(", ")}
          </Typography>
        </Box>
        
        <Box sx={{ mt: 'auto' }}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">
                Credits: {course.credits}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">
                Difficulty: {course.avgOverallDifficulty.toFixed(1)}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">
                Effort: {course.avgEffortForGoodGrade.toFixed(1)}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}

CourseCard.propTypes = {
  course: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    instructor: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired
    })).isRequired,
    credits: PropTypes.number.isRequired,
    avgRating: PropTypes.number.isRequired,
    avgOverallDifficulty: PropTypes.number.isRequired,
    avgEffortForGoodGrade: PropTypes.number.isRequired,
  }).isRequired,
  handleCardClick: PropTypes.func.isRequired,
};

export default CourseCard;
