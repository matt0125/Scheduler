import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Autocomplete from '@mui/lab/Autocomplete';
import { Container, Button, Typography, Box, TextField, FormControl, Snackbar } from '@mui/material';

const PositionSelector = ({ managerId, onPositionSelection }) => {
  const [positions, setPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (managerId) {
      const jwtToken = localStorage.getItem('token');
      axios
        .get(`http://large.poosd-project.com/api/positions/${managerId}`, {
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
  }, [managerId]);

  useEffect(() => {
    // After positions are set, check for the selected position in local storage
    const storedPositionId = localStorage.getItem('selectedPositionId');
    if (storedPositionId) {
      const storedPosition = positions.find(position => position._id === storedPositionId);
      setSelectedPosition(storedPosition);
    }
  }, [positions]); // This effect should run whenever positions change

  const handlePositionChange = (event, value) => {
    setSelectedPosition(value);
    if (value) {
      localStorage.setItem('selectedPositionId', value._id);
    } else {
      localStorage.removeItem('selectedPositionId');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedPosition) {
      setError(false);
      // Call onPositionSelection only here, on successful submit
      onPositionSelection(true);
    } else {
      setError(true);
      onPositionSelection(false); // Optionally inform the parent component of the error state
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
                  sx={selectedPosition ? {
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
