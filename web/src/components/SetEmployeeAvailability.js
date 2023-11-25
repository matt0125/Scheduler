import React, { useState } from 'react';
import { Container, Paper, Checkbox, FormControlLabel, TextField, Button, Grid, Typography } from '@mui/material';

const SetEmployeeAvailability = () => {
  const [availability, setAvailability] = useState({
    Mon: { available: false, startTime: '08:00', endTime: '21:00' },
    Tue: { available: false, startTime: '08:00', endTime: '21:00' },
    Wed: { available: false, startTime: '08:00', endTime: '21:00' },
    Thu: { available: false, startTime: '08:00', endTime: '21:00' },
    Fri: { available: false, startTime: '08:00', endTime: '21:00' },
    Sat: { available: false, startTime: '08:00', endTime: '21:00' },
    Sun: { available: false, startTime: '08:00', endTime: '21:00' },
  });

  const handleCheckboxChange = (day) => (event) => {
    setAvailability({ ...availability, [day]: { ...availability[day], available: event.target.checked } });
  };

  const handleTimeChange = (day, isStartTime) => (event) => {
    setAvailability({
      ...availability,
      [day]: {
        ...availability[day],
        [isStartTime ? 'startTime' : 'endTime']: event.target.value
      }
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Submit logic goes here
  };

  return (
    <Container maxWidth="sm" sx={{ flexGrow: 1, padding: 3 }}>
      <Typography variant="h4" gutterBottom>Set Employee Availability</Typography>
      <form onSubmit={handleSubmit}>
        {Object.entries(availability).map(([day, { available, startTime, endTime }]) => (
          <Paper key={day} sx={{ padding: 2, textAlign: 'center', color: 'text.secondary', marginBottom: 2 }}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={available}
                      onChange={handleCheckboxChange(day)}
                      name={`${day}-checkbox`}
                      color="primary"
                    />
                  }
                  label={day}
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  label="Start Time"
                  type="time"
                  value={startTime}
                  onChange={handleTimeChange(day, true)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5 min
                  }}
                  sx={{ width: '100%' }}
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  label="End Time"
                  type="time"
                  value={endTime}
                  onChange={handleTimeChange(day, false)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5 min
                  }}
                  sx={{ width: '100%' }}
                />
              </Grid>
            </Grid>
          </Paper>
        ))}
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item>
            <Button variant="outlined" onClick={() => { /* back logic here */ }}>Back</Button>
          </Grid>
          <Grid item>
            <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>Submit</Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default SetEmployeeAvailability;
