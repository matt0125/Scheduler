import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const EmployeeRegistration = () => {
  const [manager, setManager] = useState('');

  const handleManagerChange = (event) => {
    setManager(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle the form submission, e.g., send data to a backend server
    console.log(`Selected Manager: ${manager}`);
    // Assuming you'd want to do something with the selected manager here
  };

  // Dummy list of managers for the dropdown
  const managers = [
    { name: 'Manager 1', id: 'manager1' },
    { name: 'Manager 2', id: 'manager2' },
    // ... other managers
  ];

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Employee Registration
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="manager-select-label">Whose your manager?</InputLabel>
            <Select
              labelId="manager-select-label"
              id="manager"
              value={manager}
              label="Whose your manager?"
              onChange={handleManagerChange}
            >
              {managers.map((mgr) => (
                <MenuItem key={mgr.id} value={mgr.name}>
                  {mgr.name}
                </MenuItem>
              ))}
            </Select>
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

export default EmployeeRegistration;
