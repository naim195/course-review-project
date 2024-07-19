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
  ToggleButtonGroup,
  ToggleButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import PropTypes from "prop-types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
      {/* Sorting Section */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Sort Courses</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => handleSort("sortBy", e.target.value)}
                  label="Sort By"
                >
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
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 3 }} />
      {/* Filtering Section */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Filter Courses</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Course Availability
              </Typography>
              <ToggleButtonGroup
                value={filters.isBeingOffered}
                exclusive
                onChange={(_, newValue) =>
                  handleFilter("isBeingOffered", newValue)
                }
                aria-label="course availability"
              >
                <ToggleButton value={true} aria-label="offered courses">
                  Offered
                </ToggleButton>
                <ToggleButton value={false} aria-label="not offered courses">
                  Not Offered
                </ToggleButton>
                <ToggleButton value={null} aria-label="all courses">
                  All
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
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
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Minimum Rating
              </Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={filters.avgRating || 1}
                  onChange={(_, newValue) =>
                    handleFilter("avgRating", newValue)
                  }
                  step={1}
                  marks
                  min={1}
                  max={5}
                  valueLabelDisplay="auto"
                />
              </Box>
            </Grid>
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

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Active Filters
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {filters.credits.length > 0 && (
                <Chip
                  label={`Credits: ${filters.credits.join(", ")}`}
                  onDelete={() => handleFilter("credits", [])}
                />
              )}
              {filters.avgRating && (
                <Chip
                  label={`Min Rating: ${filters.avgRating}`}
                  onDelete={() => handleFilter("avgRating", null)}
                />
              )}
              {filters.avgOverallDifficulty && (
                <Chip
                  label={`Max Difficulty: ${filters.avgOverallDifficulty}`}
                  onDelete={() => handleFilter("avgOverallDifficulty", null)}
                />
              )}
              {filters.avgEffortForGoodGrade && (
                <Chip
                  label={`Max Effort: ${filters.avgEffortForGoodGrade}`}
                  onDelete={() => handleFilter("avgEffortForGoodGrade", null)}
                />
              )}
              {filters.isBeingOffered !== null && (
                <Chip
                  label={`Availability: ${filters.isBeingOffered ? "Offered" : "Not Offered"}`}
                  onDelete={() => handleFilter("isBeingOffered", null)}
                />
              )}
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
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
    isBeingOffered: PropTypes.bool,
  }).isRequired,
  handleSort: PropTypes.func.isRequired,
  handleFilter: PropTypes.func.isRequired,
};

export default SortFilterOptions;
