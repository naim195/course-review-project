import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid,
  Divider,
  Paper,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Slider,
  Box,
  Chip,
} from "@mui/material";
import PropTypes from "prop-types";

// component for sorting and filtering options
function SortFilterOptions({
  sortBy,
  sortOrder,
  filters,
  handleSort,
  handleFilter,
}) {
  return (
    <Paper elevation={3} sx={{ mb: 4, p: 3 }}>
      {/* Main title */}
      <Typography variant="h5" gutterBottom>
        Course Options
      </Typography>

      {/* Sorting section */}
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Sort Courses
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Sort By dropdown */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => handleSort("sortBy", e.target.value)}
              label="Sort By"
            >
              {/* Sort options */}
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="code">Code</MenuItem>
              <MenuItem value="credits">Credits</MenuItem>
              <MenuItem value="avgRating">Average Rating</MenuItem>
              <MenuItem value="avgOverallDifficulty">Difficulty</MenuItem>
              <MenuItem value="avgEffortForGoodGrade">
                Effort for Good Grade
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {/* Sort Order dropdown */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Sort Order</InputLabel>
            <Select
              value={sortOrder}
              onChange={(e) => handleSort("sortOrder", e.target.value)}
              label="Sort Order"
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Filtering section */}
      <Typography variant="h6" gutterBottom>
        Filter Courses
      </Typography>
      <Grid container spacing={3}>
        {/* Credits filter */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Credits
          </Typography>
          <FormGroup row>
            {[1, 2, 3, 4, 5].map((credit) => (
              <FormControlLabel
                key={credit}
                control={
                  <Checkbox
                    checked={filters.credits.includes(credit)}
                    onChange={(e) => {
                      const newCredits = e.target.checked
                        ? [...filters.credits, credit]
                        : filters.credits.filter((c) => c !== credit);
                      handleFilter("credits", newCredits);
                    }}
                  />
                }
                label={`${credit} credit${credit !== 1 ? "s" : ""}`}
              />
            ))}
          </FormGroup>
        </Grid>

        {/* Minimum Rating filter */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Minimum Rating
          </Typography>
          <Box sx={{ px: 2 }}>
            <Slider
              value={filters.avgRating || 1}
              onChange={(_, newValue) => handleFilter("avgRating", newValue)}
              step={1}
              marks
              min={1}
              max={5}
              valueLabelDisplay="auto"
            />
          </Box>
        </Grid>

        {/* Maximum Difficulty filter */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Maximum Difficulty
          </Typography>
          <Box sx={{ px: 2 }}>
            <Slider
              value={filters.avgOverallDifficulty || 5}
              onChange={(_, newValue) =>
                handleFilter("avgOverallDifficulty", newValue)
              }
              step={1}
              marks
              min={1}
              max={5}
              valueLabelDisplay="auto"
            />
          </Box>
        </Grid>

        {/* Maximum Effort for Good Grade filter */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Maximum Effort for Good Grade
          </Typography>
          <Box sx={{ px: 2 }}>
            <Slider
              value={filters.avgEffortForGoodGrade || 5}
              onChange={(_, newValue) =>
                handleFilter("avgEffortForGoodGrade", newValue)
              }
              step={1}
              marks
              min={1}
              max={5}
              valueLabelDisplay="auto"
            />
          </Box>
        </Grid>
      </Grid>

      {/* Active Filters display */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Active Filters
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {/* Credits filter chip */}
          {filters.credits.length > 0 && (
            <Chip
              label={`Credits: ${filters.credits.join(", ")}`}
              onDelete={() => handleFilter("credits", [])}
            />
          )}
          {/* Minimum Rating filter chip */}
          {filters.avgRating && (
            <Chip
              label={`Min Rating: ${filters.avgRating}`}
              onDelete={() => handleFilter("avgRating", null)}
            />
          )}
          {/* Maximum Difficulty filter chip */}
          {filters.avgOverallDifficulty && (
            <Chip
              label={`Max Difficulty: ${filters.avgOverallDifficulty}`}
              onDelete={() => handleFilter("avgOverallDifficulty", null)}
            />
          )}
          {/* Maximum Effort filter chip */}
          {filters.avgEffortForGoodGrade && (
            <Chip
              label={`Max Effort: ${filters.avgEffortForGoodGrade}`}
              onDelete={() => handleFilter("avgEffortForGoodGrade", null)}
            />
          )}
        </Box>
      </Box>
    </Paper>
  );
}

SortFilterOptions.propTypes = {
  sortBy: PropTypes.string.isRequired,
  sortOrder: PropTypes.oneOf(["asc", "desc"]).isRequired,
  filters: PropTypes.shape({
    credits: PropTypes.arrayOf(PropTypes.number).isRequired,
    avgRating: PropTypes.number,
    avgOverallDifficulty: PropTypes.number,
    avgEffortForGoodGrade: PropTypes.number,
  }).isRequired,
  handleSort: PropTypes.func.isRequired,
  handleFilter: PropTypes.func.isRequired,
};

export default SortFilterOptions;
