import { Grid, TextField, MenuItem, Alert, Box } from "@mui/material";
import PropTypes from "prop-types";

function SearchBar({ searchCategory, setSearchCategory, searchTerm, handleSearchChange, showAlert }) {
  return (
    <Box mb={4}>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={4} md={3}>
          <TextField
            select
            label="Category.."
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            variant="outlined"
            fullWidth
          >
            <MenuItem value="code">Course Code</MenuItem>
            <MenuItem value="name">Course Name</MenuItem>
            <MenuItem value="instructor">Instructor</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={6} sm={8} md={9}>
          <TextField
            label="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            onClick={(e) => e.stopPropagation()}
            variant="outlined"
            fullWidth
          />
        </Grid>
      </Grid>
      {showAlert && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Please select a category before searching.
        </Alert>
      )}
    </Box>
  );
}

SearchBar.propTypes = {
  searchCategory: PropTypes.string.isRequired,
  setSearchCategory: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  handleSearchChange: PropTypes.func.isRequired,
  showAlert: PropTypes.bool.isRequired,
};

export default SearchBar;
