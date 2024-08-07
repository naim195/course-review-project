import { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Rating,
  Button,
  Pagination,
} from "@mui/material";
import PropTypes from "prop-types";

export function Reviews({ reviews, user, handleDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Calculate the reviews to display on the current page
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  return (
    <Box my={4}>
      <Grid container spacing={2}>
        {currentReviews.map((review, index) => (
          <Grid item xs={12} key={review._id || index}>
            <Paper
              elevation={3}
              sx={{
                padding: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="body1" gutterBottom>
                  {review.textReview}
                </Typography>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mt={2}
                >
                  <Rating value={review.rating} precision={0.5} readOnly />
                  <Typography variant="body2">
                    {review.author ? review.author.displayName : "Anonymous"}
                  </Typography>
                </Box>
                <Box mt={2}>
                  <Typography variant="body2" gutterBottom>
                    Effort for Good Grade: {review.effortForGoodGrade}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Overall Difficulty: {review.overallDifficulty}
                  </Typography>
                </Box>
              </Box>
              {/* Display delete button if the user is the author of the review */}
              {user && review.author._id === user._id && (
                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(review._id)}
                    fullWidth
                  >
                    Delete
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={Math.ceil(reviews.length / reviewsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
}

Reviews.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      textReview: PropTypes.string,
      rating: PropTypes.number,
      author: PropTypes.shape({
        _id: PropTypes.string,
        displayName: PropTypes.string,
      }),
      effortForGoodGrade: PropTypes.string,
      overallDifficulty: PropTypes.string,
    }),
  ).isRequired,
  user: PropTypes.shape({
    _id: PropTypes.string,
  }),
  handleDelete: PropTypes.func.isRequired,
};
