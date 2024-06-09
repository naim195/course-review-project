import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import axios from "axios";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import CourseList from "./components/CourseList";
import Course from "./components/Course";
import Homepage from "./components/Homepage";
import NotFound from "./components/NotFound";
import Login from "./components/Login";

function App() {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState();

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
      console.log(data);
      setUser(data.user);
    } catch (error) {
      console.error("Google sign-in failed:", error);
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
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  return (
    <div>
      <NavBar
        user={user}
        handleGoogleSignIn={handleGoogleSignIn}
        handleLogout={handleLogout}
      />

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/courses"
          element={
            <CourseList courses={courses} setCourses={setCourses} user={user} />
          }
        />
        <Route path="/login/success" element={<Login />} />
        <Route path="/courses/:courseId" element={<Course />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
