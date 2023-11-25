import React, { useState } from 'react';
import axios from 'axios';
import "../styles/UpdateAvailability.css";
import logo from "../images/branding-notitle.png";
import {Container, Row, Col } from "react-bootstrap";


const generateTimeSlots = (interval = 30) => {
    const times = [];
    let currentTime = new Date().setHours(0, 0, 0, 0); // Start at midnight
  
    while (currentTime <= new Date().setHours(23, 59, 0, 0)) {
      let time = new Date(currentTime);
      times.push(time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
      currentTime += interval * 60 * 1000; // Add interval minutes
    }
  
    return times;
  };

// Default interval of 30 minutes
const timeOptions = generateTimeSlots();
const UpdateAvailability = () => {
  // State to keep track of the availability
  const [availability, setAvailability] = useState({
    managerName: '',
    position: '',
    days: {
      Mon: { available: false, startTime: '8:00 am', endTime: '9:00 pm' },
      Tue: { available: false, startTime: '8:00 am', endTime: '9:00 pm' },
      Wed: { available: false, startTime: '8:00 am', endTime: '9:00 pm' },
      Thu: { available: false, startTime: '8:00 am', endTime: '9:00 pm' },
      Fri: { available: false, startTime: '8:00 am', endTime: '9:00 pm' },
      Sat: { available: false, startTime: '8:00 am', endTime: '9:00 pm' },
      Sun: { available: false, startTime: '8:00 am', endTime: '9:00 pm' },
    },
  });

  // Function to handle availability checkbox change
  const handleCheckboxChange = (day) => {
    setAvailability((prevAvailability) => ({
      ...prevAvailability,
      days: {
        ...prevAvailability.days,
        [day]: {
          ...prevAvailability.days[day],
          available: !prevAvailability.days[day].available,
        },
      },
    }));
  };

  // Function to handle time change
  const handleTimeChange = (day, isStart, time) => {
    setAvailability((prevAvailability) => ({
      ...prevAvailability,
      days: {
        ...prevAvailability.days,
        [day]: {
          ...prevAvailability.days[day],
          ...(isStart ? { startTime: time } : { endTime: time }),
        },
      },
    }));
  };

  // Function to handle manager name and position change
  // const handleSelectChange = (e) => {
  //   setAvailability((prevAvailability) => ({
  //     ...prevAvailability,
  //     [e.target.name]: e.target.value,
  //   }));
  // };

  // Function to submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Construct the payload, you might need to adjust this based on your API requirements
    const payload = {
      dayOfWeek: availability.managerName,
      startTime: availability.position,
      endTime: availability.days,
    };

    try {
      // Replace 'YOUR_API_ENDPOINT' with the actual endpoint of your backend
      const response = await axios.put('http://large.poosd-project.com/api/employee/654c4136aa30871b5bd30826/availability/654c7e645ef9e3156f0fd1cd', payload);

      // Handle the response as needed
      console.log(response.data);
      alert('Availability updated successfully!');
    } catch (error) {
      console.error('There was an error updating the availability:', error);

      alert('Failed to update availability.');
    }
  };

  return (
    <Container className="update-Avail-Page">
      <Row>
        <Col xs={12} md={3}>
          <div className="logo-container">
            <h1>Sched</h1>
            <img src={logo} alt="sched logo" className="logo"></img>
          </div>
        </Col>
        <Col xs={12} md={{span: 6, offset: 3}} className="background-square">
            <h2 className="update-title">Update Availability</h2>
            <form onSubmit={handleSubmit}>
              <h3>What days are you available?</h3>
              {/* Availability for each day */}
              <div className="availabilities">
              {Object.keys(availability.days).map((day) => (
                <Row key={day} className="d-flex align-items-center">
                  <Col>
                    <label>
                      <input
                        type="checkbox"
                        checked={availability.days[day].available}
                        onChange={() => handleCheckboxChange(day)}
                      />
                      {day}:
                    </label>
                  </Col>
                  <Col className="time-selects d-flex align-items-start"> 
                      <select className="start mr-2"
                        value={availability.days[day].startTime}
                        onChange={(e) => handleTimeChange(day, true, e.target.value)}
                      >
                        {timeOptions.map(time => (
                          <option key={`${day}-start-${time}`} value={time}>{time}</option>
                        ))}
                      </select>
                      <select className="end mr-2"
                        value={availability.days[day].endTime}
                        onChange={(e) => handleTimeChange(day, false, e.target.value)}
                      >
                      {timeOptions.map(time => (
                          <option key={`${day}-end-${time}`} value={time}>{time}</option>
                      ))}
                      </select>
                  </Col>
                </Row>
              ))}
              </div>
              <Row className="mt-3">
                  <button type="button" className="button-container" onClick={() => window.history.back()}>Back</button>
                  <button type="submit" className="button-container">Update Availability</button>
              </Row>
              </form>
          </Col>
        </Row>
    </Container>
  );
};

export default UpdateAvailability;
