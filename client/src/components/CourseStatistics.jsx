import { Box, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import PropTypes from "prop-types";

export function CourseStatistics({ reviews }) {
  // Initialize grade frequency map
  let gradeFreqMap = {
    A: 0,
    "A-": 0,
    B: 0,
    "B-": 0,
    C: 0,
    "C-": 0,
    D: 0,
    E: 0,
  };

  // Populate the frequency map with review data
  reviews.forEach((review) => {
    const grade = review.grade;
    if (grade in gradeFreqMap) {
      gradeFreqMap[grade]++;
    }
  });

  // Generate data for the chart
  const graphData = Object.entries(gradeFreqMap).map(([grade, freq]) => ({
    x: grade,
    y: freq,
  }));

  return (
    <div>
      <Typography variant="h4" component="h2" gutterBottom>
        Course Statistics
      </Typography>
      {reviews.length > 0 ? (
        <Box sx={{ height: 400, width: "100%" }}>
          <BarChart
            xAxis={[{ scaleType: "band", data: graphData.map((it) => it.x) }]}
            series={[{ data: graphData.map((it) => it.y) }]}
            height={400}
          />
        </Box>
      ) : (
        <Typography variant="body1">No reviews yet.</Typography>
      )}
    </div>
  );
}

CourseStatistics.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      grade: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
