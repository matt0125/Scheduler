import React, { useState } from 'react';
import axios from 'axios';
import "../styles/UpdateAvailability.css";
import logo from "../images/branding-notitle.png";
import { Container, Row, Col } from "react-bootstrap";

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
      Tues: { available: false, startTime: '8:00 am', endTime: '9:00 pm' },
      Wed:  { available: false, startTime: '8:00 am', endTime: '9:00 pm' },
      Thur: { available: false, startTime: '8:00 am', endTime: '9:00 pm' },
      Fri:  { available: false, startTime: '8:00 am', endTime: '9:00 pm' },
      Sat:  { available: false, startTime: '8:00 am', endTime: '9:00 pm' },
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

  // Function to submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const jwtToken = localStorage.getItem('token');

    const payload = {
      availability: [],
    }

    Object.keys(availability.days).forEach((day) => {
      if (availability.days[day].available){
        payload.availability.push({
          dayOfWeek: getDayOfWeekNumber(day),
          oldStartTime: '',
          oldEndTime: '',
          newStartTime: availability.days[day].startTime,
          newEndTime: availability.days[day].endTime,
        });
      }
    });

    try {
      // Replace 'YOUR_API_ENDPOINT' with the actual endpoint of your backend
      const response = await axios.put('http://large.poosd-project.com/api/employee/65654c3fdbea74b48cd63dfb/availabilityByString', payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      console.log('Response status: ', response.status);
      console.log('Response data: ', response.data);

      if(response.status === 200){
        alert('Availability updated successfully!');
      }
      else {
        console.warn('Unexpected status code: ', response.status);
        alert('Failed to update availability.');
      }
    } catch (error) {
      if (error.isAxiosError) {
        console.error('Axios Error:', error.message);
        console.error('Axios Response:', error.response);
        console.error('Response header: ', error.response.headers);
      } else {
        // Other types of errors
        console.error('Error updating availability:', error);
      }

      alert('Failed to update availability.');
    }
  };

  const getDayOfWeekNumber = (day) => {
    switch(day) {
      case 'Mon':
        return 1;
      case 'Tue':
        return 2;
      case 'Wed':
        return 3;
      case 'Thu':
        return 4;
      case 'Fri':
        return 5;
      case 'Sat':
        return 6;
      case 'Sun':
        return 7;
      default:
        return 0;
    }
  }

  return (
    <Container className="update-Avail-Page">
      <Row className="justify-content-center align-items-center full-height"> 
        <Col xs={12} md={2} className="d-flex align-items-center">
          <div className="logo-container">
            <h1>Sched</h1>
            <img src={logo} alt="sched logo" className="logo"></img>
          </div>
        </Col>
        <Col xs={12} md={{ span: 6, offset: 2 }} className="background-square">
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
                      {day === 'Wed' && '\u00a0'}
                      {day === 'Fri' && '\u00a0\u00a0\u00a0'}
                      {day === 'Sat' && '\u00a0\u00a0 '}
                      {day === 'Sun' && '\u00a0'}
                    </label>
                  </Col>
                  {/* Separate columns for start and end select dropdowns */}
                  <Col className="start-column d-flex flex-column align-items-start">
                    <select className="start mb-2"
                      value={availability.days[day].startTime}
                      onChange={(e) => handleTimeChange(day, true, e.target.value)}
                    >
                      {timeOptions.map(time => (
                        <option key={`${day}-start-${time}`} value={time}>{time}</option>
                      ))}
                    </select>
                  </Col>
                  <Col className="end-column d-flex flex-column align-items-start">
                    <select className="end mb-2"
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
