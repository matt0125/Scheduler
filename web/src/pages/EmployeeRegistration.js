import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Typography, Box, FormControl, Snackbar, TextField } from '@mui/material';
import Autocomplete from '@mui/lab/Autocomplete';
import PositionSelector from '../components/PositionSelector';
import SetEmployeeAvailability from '../components/SetEmployeeAvailability'; // Import the SetEmployeeAvailability component
import '../styles/EmployeeRegistration.css';

const EmployeeRegistration = () => {
  const [manager, setManager] = useState(null);
  const [managers, setManagers] = useState([]);
  const [showPositionSelector, setShowPositionSelector] = useState(false);
  const [showEmployeeAvailability, setShowEmployeeAvailability] = useState(false); // New state for controlling visibility of SetEmployeeAvailability
  const jwtToken = localStorage.getItem('token');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await axios.get('http://large.poosd-project.com/api/managers', {
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
          }
        });
        const managerList = response.data.managers.filter(user => user.managerIdent);
        setManagers(managerList);
      } catch (error) {
        console.error('Error fetching managers:', error);
      }
    };

    fetchManagers();
  }, []);

  const handleManagerChange = (event, value) => {
    setManager(value);
    if (value) {
      localStorage.setItem('selectedManagerId', value._id);
      setSuccess(false);
    } else {
      // Clear both selectedManagerId and selectedPositionId from local storage
      localStorage.removeItem('selectedManagerId');
      localStorage.removeItem('selectedPositionId');
      setSuccess(false);
      setShowPositionSelector(false);
      setShowEmployeeAvailability(false); // Hide the availability settings as well
    }
  };

  // This function is passed to PositionSelector and is called on submit
  const handlePositionSelection = (isPositionSelected) => {
    setShowEmployeeAvailability(isPositionSelected);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowPositionSelector(!!manager);
    setSuccess(!!manager);
    setError(!manager);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Employee Update
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <FormControl fullWidth margin="normal">
            <Autocomplete
              id="manager-autocomplete"
              options={managers}
              getOptionLabel={(option) => option.username}
              onChange={handleManagerChange}
              value={manager}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Who's your manager (Enter Username)?"
                  variant="outlined"
                  style={{ minWidth: '260px' }}
                  InputProps={{
                    ...params.InputProps,
                    style: {
                      paddingRight: '0',
                    },
                  }}
                  // Apply the green border only after the form is submitted and success is true
                  sx={success ? {
                    '& .MuiOutlinedInput-root': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'green',
                        borderWidth: '2px',
                      },
                    },
                  } : {}
              }
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
      </Box>
      {showPositionSelector && (
        <PositionSelector 
          managerId={localStorage.getItem('selectedManagerId')} 
          onPositionSelection={handlePositionSelection}
        />
      )}
      {showEmployeeAvailability && <SetEmployeeAvailability />}
      <Snackbar
        open={error}
        autoHideDuration={6000}
        onClose={() => setError(false)}
        message="Please select a manager"
      />
    </Container>
  );
};

export default EmployeeRegistration;
