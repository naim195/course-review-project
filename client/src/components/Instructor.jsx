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
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [instructors, setInstructors] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const fetchInstructors = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/instructors`, {
        params: { page, limit: itemsPerPage, sort: sortOrder },
      });
      setInstructors(response.data.instructors);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [backendUrl, page, sortOrder, itemsPerPage]);

  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors]);

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Container maxWidth="md" sx={{my:4}}>
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
      <Box mt={3} display="flex" justifyContent="center">
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
