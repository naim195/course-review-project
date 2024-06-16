import { Box, Container, Typography, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        width: "100%",
        bottom: 0,
        backgroundColor: "primary.main",
        color: "white",
        padding: 2,
        textAlign: "center",
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1">
          © {new Date().getFullYear()} Course Review Platform
        </Typography>
        <Typography variant="body2">
          <Link color="inherit" href="#">
            Privacy Policy
          </Link>
          {" | "}
          <Link color="inherit" href="#">
            Terms of Service
          </Link>
          {" | "}
          <Link color="inherit" href="#">
            Contact Us
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
