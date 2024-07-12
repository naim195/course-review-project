import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { IconButton, Snackbar, SnackbarContent } from "@mui/material";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import { app } from "./firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const auth = getAuth(app);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication...");
        const res = await axios.get(`${backendUrl}/auth/check`, {
          withCredentials: true,
        });
        setUser(res.data.user);
        console.log("User authenticated:", res.data.user);
      } catch (error) {
        console.error("Auth check error", error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [backendUrl]);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      console.log("Initiating Google sign-in...");
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      console.log("Google sign-in result:", resultsFromGoogle);
      const res = await axios({
        method: "POST",
        url: `${backendUrl}/auth/google`,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          uid: resultsFromGoogle.user.uid,
        },
        withCredentials: true,
      });
      const data = res.data;
      setUser(data.user);
      console.log("User signed in:", data.user);
      showSnackbar("Sign in success.");
    } catch (error) {
      console.error("Sign-in error", error);
      showSnackbar("Sign-in failed. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      await axios.get(`${backendUrl}/auth/logout`, {
        withCredentials: true,
      });
      setUser(null); // Reset user state to null
      console.log("User logged out");
      showSnackbar("Logged out successfully!");
    } catch (error) {
      console.error("Logout error", error);
      showSnackbar("An error occurred during logout.");
    }
  };

  const showSnackbar = (message) => {
    console.log("Showing snackbar:", message);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    console.log("Closing snackbar");
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
