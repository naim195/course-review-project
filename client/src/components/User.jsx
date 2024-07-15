import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

const User = () => {
  const { user } = useContext(AuthContext); // get user from AuthContext

  return (
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <CardContent>
        {user ? (
          <>
            <Typography variant="h5" component="div" gutterBottom>
              {user.displayName}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle1">Email:</Typography>
                  <Typography variant="body1">{user.email}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box>
                  <Typography variant="subtitle1">Reviews:</Typography>
                  <Typography variant="body1">
                    {user.reviews.length} reviews
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </>
        ) : (
          <Typography variant="h6" component="div">
            You must be signed in.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default User;
