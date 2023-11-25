import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Autocomplete from '@mui/lab/Autocomplete';
import { Container, Button, Typography, Box, TextField, FormControl, Snackbar } from '@mui/material';
const PositionSelector = ({ managerId, setSuccess }) => { // Accepting managerId as a prop here
  const [positions, setPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [error, setError] = useState(false); // State to manage the error message

  useEffect(() => {
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
          if (Array.isArray(response.data.positions)) {
            setPositions(response.data.positions);
          } else {
            console.error('Error: API response data is not an array');
          }
        })
        .catch((error) => {
          console.error('Error fetching positions:', error);
        });
    }
  }, [managerId]); // Dependency array includes managerId

  // Custom filter function
  const customFilterOptions = (options, { inputValue }) =>
    options.filter((option) =>
      option.name.toLowerCase().includes(inputValue.toLowerCase())
    );

  const handlePositionChange = (event, value) => {
    setSelectedPosition(value); // Store the entire position object or just an identifier as needed
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedPosition) {
      localStorage.setItem('selectedPosition', JSON.stringify(selectedPosition));
      setSuccess(true);
      setError(false);
    } else {
      setError(true); // Set error to true if no position is selected
      setSuccess(false);
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
        <Snackbar
          open={error}
          autoHideDuration={6000}
          onClose={() => setError(false)}
          message="Please select a position"
        />
      </Box>
    </Container>
  );
};

export default PositionSelector;
