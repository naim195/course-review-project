import {
  Box,
  Grid,
  Paper,
  Typography,
  Rating,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import PropTypes from "prop-types";

// component to display course data
export function CourseData({ instructorNames, courseData }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box my={4}>
      <Paper
        elevation={3}
        sx={{
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          padding: { xs: 2, sm: 3, md: 4 },
          borderRadius: "16px",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              gutterBottom
              sx={{
                backgroundColor: courseData.isBeingOffered
                  ? "success.main"
                  : "error.main",
                color: "common.white",
                padding: "4px 8px",
                borderRadius: "4px",
                display: "inline-block",
                mb: 2,
              }}
            >
              {courseData.isBeingOffered ? "Offered" : "Not Offered"}
            </Typography>
            <Typography
              variant={isMobile ? "h4" : "h3"}
              component="h1"
              gutterBottom
              fontWeight="bold"
            >
              {courseData.name}
            </Typography>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              gutterBottom
            >
              {courseData.code}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              <strong>Instructor(s):</strong> {instructorNames}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                mb: 2,
              }}
            >
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                sx={{ mr: 2, mb: 1 }}
              >
                Average Rating:
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Rating
                  value={courseData.avgRating || 0}
                  readOnly
                  precision={0.1}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    '& .MuiRating-iconEmpty': {
                      color: 'white', // This makes the border of unfilled stars white
                    }
                  }}
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  (
                  {courseData.avgRating
                    ? courseData.avgRating.toFixed(2)
                    : "N/A"}
                  )
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2, backgroundColor: "primary.light" }} />
            <Grid container spacing={2}>
              {[
                { label: "Credits", value: courseData.credits },
                {
                  label: "Avg Effort for Good Grade",
                  value: courseData.avgEffortForGoodGrade,
                  format: "/5",
                },
                {
                  label: "Avg Overall Difficulty",
                  value: courseData.avgOverallDifficulty,
                  format: "/5",
                },
              ].map((item, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Typography
                    variant={isMobile ? "subtitle2" : "subtitle1"}
                    gutterBottom
                  >
                    <strong>{item.label}:</strong>
                  </Typography>
                  <Typography variant={isMobile ? "body2" : "body1"}>
                    {item.value
                      ? `${item.value.toFixed(2)}${item.format || ""}`
                      : "N/A"}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

CourseData.propTypes = {
  instructorNames: PropTypes.string.isRequired,
  courseData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    credits: PropTypes.number.isRequired,
    avgRating: PropTypes.number,
    avgEffortForGoodGrade: PropTypes.number,
    avgOverallDifficulty: PropTypes.number,
    isBeingOffered: PropTypes.bool.isRequired,
  }).isRequired,
};

export default CourseData;
