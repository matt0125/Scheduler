import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Typography, Box, TextField, FormControl } from '@mui/material';
import Autocomplete from '@mui/lab/Autocomplete';
import PositionSelector from '../components/PositionSelector';

const EmployeeRegistration = () => {
  const [manager, setManager] = useState('');
  const [managers, setManagers] = useState([]);
  const [showPositionSelector, setShowPositionSelector] = useState(false); // State to control PositionSelector visibility
  const jwtToken = localStorage.getItem('token'); 

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/managers', {
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
          }
        });

        // Assuming the response data is in the format { managers: [...] }
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
    if (value != null) {
      localStorage.setItem('selectedManagerId', value._id);
    } else {
      localStorage.removeItem('selectedManagerId'); // or set to a default value if required
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Debugging: log the manager state before checking
    console.log("Manager selected:", manager);
  
    if (manager) {
      console.log(`Selected Manager: ${manager.username}`);
      setShowPositionSelector(true); // Show PositionSelector after submitting manager
  
      // Debugging: log the showPositionSelector state after it's set
      console.log("showPositionSelector set to true");
    } else {
      console.log("No manager selected. Please select a manager.");
      // Debugging: log the showPositionSelector state when no manager is selected
      console.log("showPositionSelector remains false");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Employee Registration
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <FormControl fullWidth margin="normal">
            <Autocomplete
              id="manager-autocomplete"
              options={managers}
              getOptionLabel={(option) => option.username}
              onChange={handleManagerChange}
              renderInput={(params) => (
                <TextField {...params} label="Who's your manager (Enter Username)?" variant="outlined" style={{ minWidth: '250px' }} />
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
      {showPositionSelector && <PositionSelector />}
    </Container>
  );
};

export default EmployeeRegistration;
