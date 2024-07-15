import {  FormControl, InputLabel, Select, MenuItem, Typography, Grid, Divider, Paper, Checkbox, FormGroup, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import PropTypes from 'prop-types';

function SortFilterOptions({ sortBy, sortOrder, filters, handleSort, handleFilter }) {
  return (
    <Paper elevation={3} sx={{ mb: 4, p: 3 }}>
      <Typography variant="h6" gutterBottom>Sort Courses</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => handleSort('sortBy', e.target.value)}
              label="Sort By"
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="code">Code</MenuItem>
              <MenuItem value="credits">Credits</MenuItem>
              <MenuItem value="avgRating">Average Rating</MenuItem>
              <MenuItem value="avgOverallDifficulty">Difficulty</MenuItem>
              <MenuItem value="avgEffortForGoodGrade">Effort for Good Grade</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl component="fieldset">
            <RadioGroup row value={sortOrder} onChange={(e) => handleSort('sortOrder', e.target.value)}>
              <FormControlLabel value="asc" control={<Radio />} label="Ascending" />
              <FormControlLabel value="desc" control={<Radio />} label="Descending" />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>Filter Courses</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>Credits</Typography>
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
                        : filters.credits.filter(c => c !== credit);
                      handleFilter("credits", newCredits);
                    }}
                  />
                }
                label={`${credit} credit${credit !== 1 ? 's' : ''}`}
              />
            ))}
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>Minimum Rating</Typography>
          <RadioGroup
            row
            value={filters.avgRating || 1}
            onChange={(e) => handleFilter("avgRating", Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((rating) => (
              <FormControlLabel key={rating} value={rating} control={<Radio />} label={rating} />
            ))}
          </RadioGroup>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>Maximum Difficulty</Typography>
          <RadioGroup
            row
            value={filters.avgOverallDifficulty || 5}
            onChange={(e) => handleFilter("avgOverallDifficulty", Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((difficulty) => (
              <FormControlLabel key={difficulty} value={difficulty} control={<Radio />} label={difficulty} />
            ))}
          </RadioGroup>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>Maximum Effort for Good Grade</Typography>
          <RadioGroup
            row
            value={filters.avgEffortForGoodGrade || 5}
            onChange={(e) => handleFilter("avgEffortForGoodGrade", Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((effort) => (
              <FormControlLabel key={effort} value={effort} control={<Radio />} label={effort} />
            ))}
          </RadioGroup>
        </Grid>
      </Grid>
    </Paper>
  );
}

// PropTypes remain the same

SortFilterOptions.propTypes = {
  sortBy: PropTypes.string.isRequired,
  sortOrder: PropTypes.oneOf(['asc', 'desc']).isRequired,
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
