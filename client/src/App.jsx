// import {  useState } from "react";
import { Route, Routes } from "react-router-dom";
// import axios from "axios";
import { Box } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
import NavBar from "./components/ui/NavBar";
import Footer from "./components/ui/Footer";
import CourseList from "./components/CourseList";
import Course from "./components/Course";
import Homepage from "./components/Homepage";
import User from "./components/User";
import NotFound from "./components/NotFound";

function App() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <NavBar />

      <Box component="main" sx={{ flex: 1, mt: 1 }}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:courseId" element={<Course />} />
          <Route path="/user" element={<User />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>

      <Footer />
    </Box>
  );
}

export default App;
