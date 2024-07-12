import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const Instructor = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [instructors, setInstructors] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const response = await axios.get(`${backendUrl}/instructors`);
                setInstructors(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchInstructors();
    }, [backendUrl]);

    const handleSortChange = (event) => {
        const value = event.target.value;
        setSortOrder(value);
        setInstructors((prevInstructors) =>
            [...prevInstructors].sort((a, b) =>
                value === 'asc' ? a.averageRating - b.averageRating : b.averageRating - a.averageRating
            )
        );
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Instructors</Typography>
            <FormControl fullWidth variant="outlined" margin="normal">
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
            <List>
                {instructors.map((instructor) => (
                    <ListItem key={instructor._id}>
                        <ListItemText
                            primary={instructor.name}
                            secondary={`Average Rating: ${instructor.averageRating.toFixed(2)}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default Instructor;
