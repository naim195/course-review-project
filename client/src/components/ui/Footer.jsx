import { Box, Container, Typography, Link, Grid } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

const Footer = () => {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "primary.main",
        color: "white",
        padding: 3,
        textAlign: "center",
      }}
    >
      <Container maxWidth="lg">
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Open Source
            </Typography>
            <Typography variant="body2">
              This project is open source and available on GitHub. Feel free to
              contribute or report issues!
            </Typography>
            <Link
              target="_blank"
              rel="noopener"
              href="https://github.com/naim195/course-review-project"
              color="inherit"
              sx={{
                display: "flex",
                alignItems: "center",
                mt: 1,
                justifyContent: "center",
              }}
            >
              <GitHubIcon sx={{ mr: 1 }} /> View on GitHub
            </Link>
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ mt: 3, textAlign: "center" }}>
          © {new Date().getFullYear()} IITGN Course Reviews. All rights
          reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
