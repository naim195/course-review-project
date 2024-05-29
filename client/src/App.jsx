import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import CourseList from "./components/CourseList";
import Course from "./components/Course";
import Homepage from "./components/Homepage";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";

function App() {
  const [courses, setCourses] = useState([]);

  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/courses"
          element={<CourseList courses={courses} setCourses={setCourses} />}
        />
        <Route path="/courses/:courseId" element={<Course />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
