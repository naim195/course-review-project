import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { IconButton, Snackbar, SnackbarContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import { app } from "./firebase";

// Create context for authentication
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // State for user, loading status, snackbar, dialog, and pending user
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Get backend URL from environment variables
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  // Initialize Firebase auth
  const auth = getAuth(app);

  // Effect to check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        
        const res = await axios.get(`${backendUrl}/auth/check`, {
          withCredentials: true,
        });
        setUser(res.data.user);
        
      } catch (error) {
        console.error("Auth check error", error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [backendUrl]);

  // Function to handle Google Sign In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      

      // Check if the user already exists
      const userRes = await axios.get(`${backendUrl}/users/${resultsFromGoogle.user.uid}`);
      const userExists = userRes.data.exists;

      if (!userExists) {
        // If user doesn't exist, open dialog to ask for anonymous preference
        setPendingUser({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          uid: resultsFromGoogle.user.uid,
        });
        setDialogOpen(true);
      } else {
        // If user exists, proceed with sign in
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
            isAnonymous: userRes.data.isAnonymous,
          },
          withCredentials: true,
        });
        setUser(res.data.user);
        
        showSnackbar("Sign in success.");
      }
    } catch (error) {
      console.error("Sign-in error", error);
      showSnackbar("Sign-in failed. Please try again.");
    }
  };

  // Function to handle dialog close
  const handleDialogClose = async (anonymous) => {
    setDialogOpen(false);
    if (!pendingUser) return;

    const userName = anonymous ? "Anonymous" : pendingUser.name;

    try {
      const res = await axios({
        method: "POST",
        url: `${backendUrl}/auth/google`,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          name: userName,
          email: pendingUser.email,
          uid: pendingUser.uid,
          isAnonymous: anonymous,
        },
        withCredentials: true,
      });
      const data = res.data;
      setUser(data.user);
      
      showSnackbar("Sign in success.");
    } catch (error) {
      console.error("Sign-in error", error);
      showSnackbar("Sign-in failed. Please try again.");
    }
    setPendingUser(null);
  };

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      
      await axios.get(`${backendUrl}/auth/logout`, {
        withCredentials: true,
      });
      setUser(null); // Reset user state to null
     
      showSnackbar("Logged out successfully!");
    } catch (error) {
      console.error("Logout error", error);
      showSnackbar("An error occurred during logout.");
    }
  };

  // Function to show snackbar messages
  const showSnackbar = (message) => {
    
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  // Function to close snackbar
  const handleCloseSnackbar = () => {
   
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  // Provide auth context to children components
  return (
    <AuthContext.Provider
      value={{ user, loading, handleGoogleSignIn, handleLogout, showSnackbar }}
    >
      {children}
      {/* Snackbar for displaying messages */}
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
      {/* Dialog for anonymous preference */}
      <Dialog
        open={dialogOpen}
        onClose={() => handleDialogClose(false)}
      >
        <DialogTitle>Sign In</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to remain anonymous while signing in?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(true)} color="primary">
            Yes
          </Button>
          <Button onClick={() => handleDialogClose(false)} color="primary" autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </AuthContext.Provider>
  );
};

// PropTypes for type checking
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
