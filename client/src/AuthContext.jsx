import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { IconButton, Snackbar, SnackbarContent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userDataParam = urlParams.get('userData');
    if (userDataParam) {
      const userData = JSON.parse(decodeURIComponent(userDataParam));
      setUser(userData);
      window.history.replaceState({}, document.title, window.location.pathname);
      showSnackbar("Signed in successfully!");
    }
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${backendUrl}/auth/check`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Auth check failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const newWindow = window.open(
        `${backendUrl}/auth/google`,
        "_blank",
        "width=500,height=600",
      );

      await new Promise((resolve, reject) => {
        const interval = setInterval(() => {
          if (newWindow.closed) {
            clearInterval(interval);
            reject(new Error("Google sign-in process was canceled"));
          }

          try {
            const currentUrl = newWindow.location.href;
            if (currentUrl.startsWith('https://course-review-project-phi.vercel.app/')) {
              clearInterval(interval);
              const urlParams = new URLSearchParams(new URL(currentUrl).search);
              const userData = JSON.parse(decodeURIComponent(urlParams.get('userData')));
              setUser(userData);
              resolve();
              newWindow.close();
            }
          } catch (e) {
            // Ignore errors caused by cross-origin restrictions
            console.error(e);
          }
        }, 500);
      });

      showSnackbar("Signed in successfully!");
    } catch (error) {
      console.error("Google sign-in failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${backendUrl}/auth/logout`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setUser(null);
        showSnackbar("Logged out successfully!");
      } else {
        showSnackbar("Logout failed!");
      }
    } catch (error) {
      showSnackbar("An error occurred during logout.");
      console.error("An error occurred during logout:", error);
    }
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, handleGoogleSignIn, handleLogout, showSnackbar }}
    >
      {children}
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
          sx={{ backgroundColor: "#4caf50" }}
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
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
