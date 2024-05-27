import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import CourseList from "./components/CourseList";
import Course from "./components/Course";

function App() {
  const [courses, setCourses] = useState([]);
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={<CourseList courses={courses} setCourses={setCourses} />}
        />
        <Route path="/courses/:courseId" element={<Course />} />
      </Routes>
    </div>
  );
}

export default App;
