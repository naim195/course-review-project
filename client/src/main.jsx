import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./AuthContext.jsx";
import { CourseProvider } from "./CourseContext.jsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* for routing */}
    <BrowserRouter>
      {/* makes authentication context available throughout  */}
      <AuthProvider>
        {/* makes course-related context available throughout */}
        <CourseProvider>
          {/* main App component */}
          <App />
        </CourseProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
