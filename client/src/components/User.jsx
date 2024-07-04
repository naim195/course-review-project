import PropTypes from "prop-types";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";

const userShape = PropTypes.shape({
  _id: PropTypes.string,
  googleId: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  reviews: PropTypes.array.isRequired,
  __v: PropTypes.number.isRequired,
});

const User = ({ user }) => {
  return user ? (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
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
      </CardContent>
    </Card>
  ) : (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div">
          You must be signed in.
        </Typography>
      </CardContent>
    </Card>
  );
};

User.propTypes = {
  user: userShape,
};

export default User;
