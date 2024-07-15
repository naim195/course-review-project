import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Box,
  Card,
  CardContent,
  Grid,
} from "@mui/material";

const Instructor = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // backend URL from environment variables
  const [instructors, setInstructors] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1); //current page number
  const [totalPages, setTotalPages] = useState(1); //total pages
  const itemsPerPage = 10; // Number of items to display per page

  //function to fetch instructors from the backend
  const fetchInstructors = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/instructors`, {
        params: { page, limit: itemsPerPage, sort: sortOrder }, //query params for pagination and sorting
      });
      setInstructors(response.data.instructors);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching data:", error); //handle error
    }
  }, [backendUrl, page, sortOrder, itemsPerPage]);

  // fetch instructors when component mounts or dependencies change
  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors]);

  //function to change sorting order
  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
    setPage(1);
  };

  //fucntion to handle page changes
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom align="center">
        Instructors
      </Typography>
      <Box mb={3}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Sort by Average Rating</InputLabel>
          <Select
            value={sortOrder}
            onChange={handleSortChange}
            label="Sort by Average Rating"
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={3}>
        {instructors.map((instructor) => (
          <Grid item xs={12} sm={6} md={4} key={instructor._id}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" component="div">
                  {instructor.name}
                </Typography>
                <Typography color="text.secondary">
                  Average Rating: {instructor.averageRating.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box mt={3} mb={3} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default Instructor;
