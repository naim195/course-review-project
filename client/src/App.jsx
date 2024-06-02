import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import CourseList from "./components/CourseList";
import Course from "./components/Course";
import Homepage from "./components/Homepage";
import NotFound from "./components/NotFound";
import Login from "./components/Login";

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
        <Route path="/login/success" element={<Login/>}/>
        <Route path="/courses/:courseId" element={<Course />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;