import { Box, Grid, Paper, Typography, Rating, Divider } from "@mui/material";
import PropTypes from "prop-types";

export function CourseData({ instructorNames, courseData }) {
  return (
    <Box my={4}>
      <Paper
        elevation={3}
        sx={{
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          padding: "32px",
          borderRadius: "16px",
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
              {courseData.name}
            </Typography>
            <Typography variant="h5" gutterBottom>
              {courseData.code}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Instructor(s): {instructorNames}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ mr: 2 }}>
                Average Rating:
              </Typography>
              <Rating
                value={courseData.avgRating || 0}
                readOnly
                precision={0.1}
              />
              <Typography variant="body1" sx={{ ml: 1 }}>
                ({courseData.avgRating ? courseData.avgRating.toFixed(2) : "N/A"})
              </Typography>
            </Box>
            <Divider sx={{ my: 2, backgroundColor: 'primary.light' }} />
            <Typography variant="h6" gutterBottom>
              Credits: {courseData.credits}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Avg Effort for Good Grade:{" "}
              {courseData.avgEffortForGoodGrade
                ? `${courseData.avgEffortForGoodGrade.toFixed(2)}/5`
                : "N/A"}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Avg Overall Difficulty:{" "}
              {courseData.avgOverallDifficulty
                ? `${courseData.avgOverallDifficulty.toFixed(2)}/5`
                : "N/A"}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

CourseData.propTypes = {
  instructorNames: PropTypes.string,
  courseData: PropTypes.shape({
    name: PropTypes.string,
    code: PropTypes.string,
    credits: PropTypes.number,
    avgRating: PropTypes.number,
    avgEffortForGoodGrade: PropTypes.number,
    avgOverallDifficulty: PropTypes.number,
  }).isRequired,
};