import React, { useState } from 'react';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const EmployeeRegistration = () => {
  const [managerName, setManagerName] = useState('');

  const handleInputChange = (event) => {
    setManagerName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`Manager Name: ${managerName}`);
    // Perform registration logic here
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Employee Registration
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="managerName"
            label="Manager Name"
            name="managerName"
            autoComplete="name"
            autoFocus
            value={managerName}
            onChange={handleInputChange}
          />
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
