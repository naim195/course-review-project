import CssBaseline from "@mui/material/CssBaseline";
import { Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import NavBar from "./components/ui/NavBar";
import Footer from "./components/ui/Footer";
import CourseList from "./components/CourseList";
import Course from "./components/Course";
import Homepage from "./components/Homepage";
import User from "./components/User";
import Instructor from "./components/Instructor";
import NotFound from "./components/NotFound";

function App() {
  return (
    <>
      {/* CssBaseline component to normalize styles across browsers */}
      <CssBaseline />

      {/* Main container for the entire application */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh", // Ensure the app takes at least the full viewport height
          padding: 0,
        }}
      >
        {/* Navigation bar component */}
        <NavBar />

        {/* Main content area */}
        <Box component="main" sx={{ flex: 1, mt: 1 }}>
          {/* Define routes for different pages */}
          <Routes>
            {/* Homepage route */}
            <Route path="/" element={<Homepage />} />

            {/* Course list route */}
            <Route path="/courses" element={<CourseList />} />

            {/* Individual course route with dynamic courseId parameter */}
            <Route path="/courses/:courseId" element={<Course />} />

            {/* Instructors route */}
            <Route path="/instructors" element={<Instructor />} />

            {/* User profile route */}
            <Route path="/user" element={<User />} />

            {/* 404 Not Found route for any unmatched paths */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>

        {/* Footer component */}
        <Footer />
      </Box>
    </>
  );
}

export default App;
