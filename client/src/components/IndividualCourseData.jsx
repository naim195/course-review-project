import { Box, Grid, Paper, Typography } from "@mui/material";
import PropTypes from "prop-types";

export function CourseData({ instructorNames, courseData }) {
  return (
    <Box my={4}>
      <Paper
        elevation={3}
        sx={{
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          padding: "24px",
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h3" component="h1" gutterBottom>
              {courseData.name}
            </Typography>
            <Typography variant="h5" gutterBottom>
              {courseData.code}
            </Typography>
            <Typography variant="body1">{instructorNames}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Credits: {courseData.credits}
            </Typography>
            <Typography variant="h6" gutterBottom>
  Avg Rating: {courseData.avgRating ? courseData.avgRating.toFixed(2) : 'N/A'}
</Typography>
<Typography variant="h6" gutterBottom>
  Avg Effort for Good Grade: {courseData.avgEffortForGoodGrade ? courseData.avgEffortForGoodGrade.toFixed(2) : 'N/A'}
</Typography>
<Typography variant="h6" gutterBottom>
  Avg Overall Difficulty: {courseData.avgOverallDifficulty ? courseData.avgOverallDifficulty.toFixed(2) : 'N/A'}
</Typography>

          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

CourseData.propTypes = {
  instructorNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  courseData: PropTypes.shape({
    name: PropTypes.string,
    code: PropTypes.string,
    credits: PropTypes.number,
    avgRating: PropTypes.number,
    avgEffortForGoodGrade: PropTypes.number,
    avgOverallDifficulty: PropTypes.number,
  }).isRequired,
};
