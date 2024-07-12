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
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";
import GradeIcon from "@mui/icons-material/Grade";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";
import { useTheme } from "@mui/material/styles";

const Homepage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSearch = () => {
    if (searchCategory && searchTerm) {
      navigate(`/courses?category=${searchCategory}&search=${searchTerm}`);
    }
  };
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography
          variant={isMobile ? "h3" : "h2"}
          component="h1"
          align="center"
          gutterBottom
        >
          IITGN Course Reviews
        </Typography>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          align="center"
          color="text.secondary"
          paragraph
        >
          Gamble on stocks, not your CPI.
        </Typography>
        <Typography
          variant={isMobile ? "body1" : "h6"}
          align="center"
          paragraph
        >
          Tired of that one professor who ruins your CPI every semester? Find
          the best-rated courses and dodge nutty profs like a pro!
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            justifyContent: "center",
            my: 4,
          }}
        >
          <TextField
            select
            label="Hunt for"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            sx={{
              width: isMobile ? "100%" : "20%",
              mb: isMobile ? 2 : 0,
              mr: isMobile ? 0 : 1,
            }}
          >
            <MenuItem value="code">Course Code(for nerds)</MenuItem>
            <MenuItem value="name">Course Name(for normal people)</MenuItem>
            <MenuItem value="instructor">Instructor(pick your poison)</MenuItem>
          </TextField>
          <TextField
            variant="outlined"
            placeholder="Type here, your future self will thank you"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: isMobile ? "100%" : "50%",
              mb: isMobile ? 2 : 0,
              mr: isMobile ? 0 : 1,
            }}
          />
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            disabled={!searchCategory || !searchTerm}
            fullWidth={isMobile}
          >
            Search
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ mt: 4 }}>
          {[
            {
              icon: SchoolIcon,
              title: "Course Catalog",
              action: "Explore Courses",
              route: "/courses",
            },
            {
              icon: GradeIcon,
              title: "Prof Hall of Fame",
              action: "Meet the Least Scary Ones",
              route: "/instructors",
            },
            {
              icon: AssignmentIcon,
              title: "Vent Your Feelings",
              action: 'Write a "Love" Letter',
              route: "/courses",
            },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  textAlign: "center",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <item.icon
                    sx={{
                      fontSize: 60,
                      color:
                        theme.palette[
                          index === 0
                            ? "primary"
                            : index === 1
                              ? "secondary"
                              : "success"
                        ].main,
                    }}
                  />
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    {item.title}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => navigate(item.route)}
                >
                  {item.action}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 6 }}>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            align="center"
            gutterBottom
          >
            How Courses Are Rated
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }} alignItems="stretch">
            {[
              {
                icon: Rating,
                label: "Overall Rating",
                description: "How much you'll love (or hate) this course",
              },
              {
                icon: AssignmentIcon,
                label: "Effort to get a good grade",
                description: "How many all-nighters you'll pull",
              },
              {
                icon: SchoolIcon,
                label: "Overall Difficulty",
                description: "How many brain cells you'll lose",
              },
              {
                icon: PersonIcon,
                label: "Instructor Rating",
                description: "Fair grades or impossible standards?",
              },
            ].map((item, index) => (
              <Grid item xs={6} sm={6} md={3} key={index}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    textAlign: "center",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {item.icon === Rating ? (
                    <Rating name="read-only" value={5} readOnly />
                  ) : (
                    <item.icon color="action" />
                  )}
                  <Typography variant="subtitle2" sx={{ mt: 1 }}>
                    {item.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, color: "text.secondary" }}
                  >
                    {item.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          ;
        </Box>
      </Box>
    </Container>
  );
};

export default Homepage;
