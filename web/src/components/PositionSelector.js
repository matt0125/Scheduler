import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Autocomplete from '@mui/lab/Autocomplete';
import { Container, Button, Typography, Box, TextField, FormControl, Snackbar } from '@mui/material';

const PositionSelector = ({ managerId, setSuccess }) => {
  const [positions, setPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [error, setError] = useState(false);

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
    // Check if there is a selected position in local storage when component mounts
    const storedPositionId = localStorage.getItem('selectedPositionId');
    if (storedPositionId) {
      // Find the stored position in the positions array and set it as selected
      const storedPosition = positions.find(position => position._id === storedPositionId);
      setSelectedPosition(storedPosition);
    }
  }, [managerId, positions]);

  const handlePositionChange = (event, value) => {
    setSelectedPosition(value);
    if (value) {
      localStorage.setItem('selectedPositionId', value._id);
      setSuccess(true);
    } else {
      localStorage.removeItem('selectedPositionId');
      setSuccess(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedPosition) {
      setError(false);
    } else {
      setError(true);
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
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="What is your position?"
                  variant="outlined"
                  // Apply the green border if there is a selected position ID in local storage
                  sx={localStorage.getItem('selectedPositionId') ? {
                    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'green',
                      borderWidth: '2px',
                    },
                  } : {}}
                />
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
