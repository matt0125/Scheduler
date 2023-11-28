import React, { useState } from 'react';
import { Box, Container, Paper, Checkbox, FormControlLabel, TextField, Button, Grid, Typography, IconButton } from '@mui/material';
import { useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const SetEmployeeAvailability = () => {
  const navigate = useNavigate();
    const [availability, setAvailability] = useState({
        Mon: [{ available: false, startTime: '08:00', endTime: '17:00' }],
        Tue: [{ available: false, startTime: '08:00', endTime: '17:00' }],
        Wed: [{ available: false, startTime: '08:00', endTime: '17:00' }],
        Thu: [{ available: false, startTime: '08:00', endTime: '17:00' }],
        Fri: [{ available: false, startTime: '08:00', endTime: '17:00' }],
        Sat: [{ available: false, startTime: '08:00', endTime: '17:00' }],
        Sun: [{ available: false, startTime: '08:00', endTime: '17:00' }],
      });

  const handleCheckboxChange = (day, index) => (event) => {
    const updatedDay = availability[day].map((slot, slotIndex) => 
      slotIndex === index ? { ...slot, available: event.target.checked } : slot
    );
    setAvailability({ ...availability, [day]: updatedDay });
  };

  const handleTimeChange = (day, index, isStartTime) => (event) => {
    const updatedDay = availability[day].map((slot, slotIndex) => 
      slotIndex === index ? { ...slot, [isStartTime ? 'startTime' : 'endTime']: event.target.value } : slot
    );
    setAvailability({ ...availability, [day]: updatedDay });
  };

  const handleAddTimeSlot = (day) => {
    const updatedDay = [...availability[day], { available: false, startTime: '08:00', endTime: '17:00' }];
    setAvailability({ ...availability, [day]: updatedDay });
  };

  const handleDeleteTimeSlot = (day, index) => {
    const updatedDay = availability[day].filter((_, slotIndex) => slotIndex !== index);
    setAvailability({ ...availability, [day]: updatedDay });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const jwtToken = localStorage.getItem('token');
    const employeeId = localStorage.getItem('id');
  
    // Prepare the data for each day
    const dataToSend = Object.entries(availability).flatMap(([day, slots]) =>
      slots.filter(slot => slot.available).map(slot => ({
        dayOfWeek: convertDayToNumber(day),
        startTime: slot.startTime,
        endTime: slot.endTime
      }))
    );


    // Assign manager
    try {
      const managerId = localStorage.getItem('selectedManagerId');
      if (managerId == null) {
        throw new Error("mangerId null");
      }
      const data = {
        managerId: managerId
      }

      const response = await axios.post(`http://large.poosd-project.com/api/employee/${employeeId}/assign/manager`, data, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
          }
        });

      console.log(`post assign manager:`, response);
    }
    catch (e) {
      console.error("Error assigning manager [components/SetEmployeeAvailability.js]", e);
    }

    // Assign position
    try {
      const positionId = localStorage.getItem('selectedPositionId');
      if (positionId == null) {
        throw new Error("positionId null");
      }

      const response = await axios.put(`http://large.poosd-project.com/api/employee/${employeeId}/position/${positionId}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
          }
        });

      console.log(`put add position: ${response}`);
    }
    catch (error) {
      if (!(error.response && error.response.status === 400 && error.response.data.message === "Position already assigned to this employee")) {
        console.error("Error adding position [components/SetEmployeeAvailability.js]", error);
      }
    }

    // Remove all old availability
    try {
      for (var i = 0; i < 7; i++) {
        const data = {
          dayOfWeek: `${i}`,
          startTime: '00:00',
          endTime: '23:00'
        };
        await axios.delete(`http://large.poosd-project.com/api/employee/${employeeId}/availabilityByString`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
          },
          params: data
        });
      }
    } catch (error) {
      console.error('Error deleting all availability:', error);
    }
  
    try {
      // Add availability for each time selected
      for (const slotData of dataToSend) {
        await axios.post(`http://large.poosd-project.com/api/employee/${employeeId}/availability`, slotData, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
          }
        });
      }

    } catch (error) {
      console.error('Error updating availability:', error);
    }

    navigate('/dashboard');

  };
  
  // Helper function to convert day string to day number
  function convertDayToNumber(day) {
    const days = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
    return days[day] ?? -1; // Returns -1 if day is not found
  }
  
  
  

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Set Employee Availability</Typography>
      <form onSubmit={handleSubmit}>
        {Object.entries(availability).map(([day, slots]) => (
          <Paper key={day} sx={{ padding: 1.75, marginBottom: 2}}>
            <Typography variant="h6">{day}</Typography>
            {slots.map((slot, index) => (
            <Grid container key={index} spacing={2.5} alignItems="center" sx={{ marginBottom: 1 }}>
                <Grid item xs={2} sm={1}>
                <FormControlLabel
                    control={
                    <Checkbox
                        checked={slot.available}
                        onChange={handleCheckboxChange(day, index)}
                        name={`${day}-${index}-checkbox`}
                        color="primary"
                    />
                    }
                />
                </Grid>
                <Grid item xs={5} sm={4}>
                <TextField
                    label="Start Time"
                    type="time"
                    value={slot.startTime}
                    onChange={handleTimeChange(day, index, true)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                />
                </Grid>
                <Grid item xs={5} sm={4}>
                <TextField
                    label="End Time"
                    type="time"
                    value={slot.endTime}
                    onChange={handleTimeChange(day, index, false)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                />
                </Grid>
                <Grid item xs={12} sm={2.5}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton onClick={() => handleDeleteTimeSlot(day, index)} size="medium" sx={{ marginRight: 1 }}>
                    <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => handleAddTimeSlot(day)} size="medium">
                    <AddCircleOutlineIcon />
                    </IconButton>
                </Box>
                </Grid>
            </Grid>

            ))}
          </Paper>
        ))}
        <Grid container spacing={2}>
          <Grid item xs={12}  sx={{ paddingBottom: 3 }}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default SetEmployeeAvailability;
