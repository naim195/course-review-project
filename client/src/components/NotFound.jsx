import { Container, Typography, Button, Box } from "@mui/material";
import {
  Home as HomeIcon,
  SentimentVeryDissatisfied as NotFoundIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// displays a "Page Not Found" message with a home button for navigation.

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Box sx={{ mb: 4 }}>
        <NotFoundIcon sx={{ fontSize: 100, color: "error.main" }} />
      </Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="h6" component="p" gutterBottom>
        Sorry, the page you are looking for does not exist.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<HomeIcon />}
        onClick={handleGoHome}
      >
        Go to Home
      </Button>
    </Container>
  );
};

export default NotFound;
