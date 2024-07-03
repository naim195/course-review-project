import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import axios from "axios";
import { Snackbar, SnackbarContent, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NavBar from "./components/ui/NavBar";
import Footer from "./components/ui/Footer";
import CourseList from "./components/CourseList";
import Course from "./components/Course";
import Homepage from "./components/Homepage";
import NotFound from "./components/NotFound";

function App() {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    isAuthenticated();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      // Open a new window or tab to initiate the Google sign-in flow
      const newWindow = window.open(
        "http://localhost:3000/auth/google",
        "_blank",
        "width=500,height=600",
      );

      // Wait for the Google sign-in process to complete
      const { data } = await new Promise((resolve, reject) => {
        const interval = setInterval(() => {
          if (newWindow.closed) {
            clearInterval(interval);
            reject(new Error("Google sign-in process was canceled"));
          }
        }, 500);

        window.addEventListener("message", (event) => {
          if (event.data && event.data.user) {
            clearInterval(interval);
            resolve({ data: event.data });
          }
        });
      });

      // Handle the response data (user data) from the server
      setUser(data.user);
      setSnackbarMessage("Signed in successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Google sign-in failed:", error);
    }
  };

  const isAuthenticated = async () => {
    try {
      const response = await axios.get("http://localhost:3000/auth/check", {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Auth failed", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:3000/auth/logout", {
        withCredentials: true,
      });

      if (response.status === 200) {
        setUser(null); // Clear user state after successful logout
        console.log("Logged out successfully");
        setSnackbarMessage("Logged out successfully!");
        setSnackbarOpen(true);
      } else {
        console.error("Logout failed");
        setSnackbarMessage("Logout failed!");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <NavBar
        user={user}
        handleGoogleSignIn={handleGoogleSignIn}
        handleLogout={handleLogout}
      />

      <Box component="main" sx={{ flex: 1, mt: 1 }}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route
            path="/courses"
            element={
              <CourseList
                courses={courses}
                setCourses={setCourses}
                user={user}
              />
            }
          />
          <Route path="/courses/:courseId" element={<Course />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>

      <Footer />

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <SnackbarContent
          sx={{
            backgroundColor: "#4caf50",
          }}
          message={snackbarMessage}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseSnackbar}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </Snackbar>
    </Box>
  );
}

export default App;
