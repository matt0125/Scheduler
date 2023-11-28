import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Autocomplete from '@mui/lab/Autocomplete';
import { Container, Button, Typography, Box, TextField, FormControl } from '@mui/material';

const PositionSelector = () => {
  const [positions, setPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    const managerId = localStorage.getItem('selectedManagerId');
    if (managerId) {
      const jwtToken = localStorage.getItem('token');
      axios
        .get(`http://localhost:3000/api/positions/${managerId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
        })
        .then((response) => {
          console.log('Positions:', response.data.positions);
          if (Array.isArray(response.data.positions)) { // Check if response data is an array
            setPositions(response.data.positions); // Adjust this based on your API response structure
          } else {
            console.error('Error: API response data is not an array');
          }
        })
        .catch((error) => {
          console.error('Error fetching positions:', error);
        });
    }
  }, []);

  // Custom filter function
  const customFilterOptions = (options, { inputValue }) =>
    options.filter((option) =>
      option.name.toLowerCase().includes(inputValue.toLowerCase())
    );

  const handlePositionChange = (event, value) => {
    setSelectedPosition(value); // Store the entire position object or just an identifier as needed
  };

  const handleSubmit = () => {
    if (selectedPosition) {
      localStorage.setItem('selectedPosition', JSON.stringify(selectedPosition)); // Store the position object as a string
      alert(`Position ${selectedPosition.name} saved!`); // Feedback for the user
    } else {
      alert('Please select a position.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Position Selector
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <FormControl fullWidth margin="normal">
            <Autocomplete
              id="position-autocomplete"
              options={positions}
              getOptionLabel={(option) => option.name}
              value={selectedPosition}
              onChange={handlePositionChange}
              filterOptions={customFilterOptions} // Use the custom filter function here
              renderInput={(params) => (
                <TextField {...params} label="What is your position?" variant="outlined" style={{ minWidth: '250px' }} />
              )}
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PositionSelector;
