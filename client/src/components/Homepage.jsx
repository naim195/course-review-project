import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Rating,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";
import GradeIcon from "@mui/icons-material/Grade";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";

const Homepage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  const handleSearch = () => {
    if (searchCategory && searchTerm) {
      navigate(`/courses?category=${searchCategory}&search=${searchTerm}`);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          College Course Reviews
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="text.secondary"
          paragraph
        >
          Find and review courses to help your fellow students
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <TextField
            select
            label="Category"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            sx={{ width: "20%", mr: 1 }}
          >
            <MenuItem value="code">Course Code</MenuItem>
            <MenuItem value="name">Course Name</MenuItem>
            <MenuItem value="instructor">Instructor</MenuItem>
          </TextField>
          <TextField
            variant="outlined"
            placeholder="Search for courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: "50%", mr: 1 }}
          />
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            disabled={!searchCategory || !searchTerm}
          >
            Search
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
              <SchoolIcon sx={{ fontSize: 60, color: "primary.main" }} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Explore Courses
              </Typography>
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => navigate("/courses")}
              >
                Browse Courses
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
              <GradeIcon sx={{ fontSize: 60, color: "secondary.main" }} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Top Rated Courses
              </Typography>
              <Button variant="outlined" sx={{ mt: 2 }}>
                View Best Courses
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
              <AssignmentIcon sx={{ fontSize: 60, color: "success.main" }} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Write a Review
              </Typography>
              <Button variant="outlined" sx={{ mt: 2 }}>
                Review a Course
              </Button>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" align="center" gutterBottom>
            How We Rate Courses
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={2} sx={{ p: 2, textAlign: "center" }}>
                <Rating name="read-only" value={5} readOnly />
                <Typography variant="subtitle1">Overall Rating</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={2} sx={{ p: 2, textAlign: "center" }}>
                <AssignmentIcon color="action" />
                <Typography variant="subtitle1">
                  Effort for Good Grade
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={2} sx={{ p: 2, textAlign: "center" }}>
                <SchoolIcon color="action" />
                <Typography variant="subtitle1">Overall Difficulty</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={2} sx={{ p: 2, textAlign: "center" }}>
                <PersonIcon color="action" />
                <Typography variant="subtitle1">Instructor Rating</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Homepage;
