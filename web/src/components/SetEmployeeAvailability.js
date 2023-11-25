import React, { useState } from 'react';
import { Container, Paper, Checkbox, FormControlLabel, TextField, Button, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

const SetEmployeeAvailability = () => {
    const classes = useStyles();
    const [availability, setAvailability] = useState({
      Mon: { available: false, startTime: '8:00 AM', endTime: '9:00 PM' },
      Tue: { available: false, startTime: '8:00 AM', endTime: '9:00 PM' },
      Wed: { available: false, startTime: '8:00 AM', endTime: '9:00 PM' },
      Thu: { available: false, startTime: '8:00 AM', endTime: '9:00 PM' },
      Fri: { available: false, startTime: '8:00 AM', endTime: '9:00 PM' },
      Sat: { available: false, startTime: '8:00 AM', endTime: '9:00 PM' },
      Sun: { available: false, startTime: '8:00 AM', endTime: '9:00 PM' },
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
    <Container maxWidth="sm" className={classes.root}>
      <Typography variant="h4" gutterBottom>Set Employee Availability</Typography>
      <form onSubmit={handleSubmit}>
        {Object.entries(availability).map(([day, { available, startTime, endTime }]) => (
          <Paper key={day} className={classes.paper}>
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
                />
              </Grid>
            </Grid>
          </Paper>
        ))}
        <Grid container spacing={2} justify="space-between">
          <Grid item>
            <Button variant="contained" onClick={() => { /* back logic here */ }}>Back</Button>
          </Grid>
          <Grid item>
            <Button type="submit" variant="contained" color="primary" className={classes.button}>Submit</Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default SetEmployeeAvailability;
