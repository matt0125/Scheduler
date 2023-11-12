import React from 'react'
import { formatDate } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from './event-utils'
import "../styles/Dashboard.css";
import logo from "../images/branding.png";
import profile from "../images/profile-button.svg";
import axios from 'axios';
import Modal from 'react-modal';
import { useNavigate } from "react-router-dom";
import { withRouter } from 'react-router-dom';

export default class DemoApp extends React.Component {
  state = {
    weekendsVisible: true,
    currentEvents: [],
    positions: [], // To store the list of positions
    selectedPositionId: null, // To store the selected position ID
    showModal: false,  // Add this line
    shiftTemplates: []
  }
   // Function to handle opening the modal
   openModal = () => {
    this.setState({ showModal: true });
  }

  // Function to handle closing the modal
  closeModal = () => {
    this.setState({ showModal: false });
  }

  // Function to handle sign out
  handleSignOut = () => {
    localStorage.clear();
    this.props.navigate('/'); // Use the navigate function passed as a prop
  }

  // Function to handle edit profile
  handleEditProfile = () => {
    // Assuming the employee ID is stored in localStorage
    const employeeId = localStorage.getItem('id'); 

    // Navigate to the EditProfile page with the employee ID
    this.props.navigate(`/edit-profile/${employeeId}`);
  };


  componentDidMount() {
    this.fetchPositions();
    this.fetchShiftTemplates();
  }

  renderPositionSelect() {
    return (
      <select onChange={this.handlePositionSelect} value={this.state.selectedPositionId || ''}>
        <option value="">Select Position</option>
        {this.state.positions.map(position => (
          <option key={position._id} value={position._id}>{position.name}</option>
        ))}
      </select>
    );
  }

  fetchPositions = async () => {
    // Fetch the positions based on the manager ID
    // The manager ID should ideally come from a logged-in manager's data
    const managerId = localStorage.getItem('id');
    const jwtToken = localStorage.getItem('token');
    
    try {
      const response = await axios.get(`http://localhost:3000/api/positions/${managerId}`, {
        headers: {
          contentType: 'application/json',
          Authorization: `Bearer ${jwtToken}`
        }
      });

      this.setState({ positions: response.data });
    } catch (error) {
      alert('Failed to fetch positions: ' + error.message);
      console.log(error);
    }
  }

  fetchShiftTemplates = async () => {
    const managerId = localStorage.getItem('id');
    const jwtToken = localStorage.getItem('token');
  
    try {
      const response = await axios.get(`http://localhost:3000/api/shift-templates/manager/${managerId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
  
      // Check if the response is an array
      if (Array.isArray(response.data)) {
        const formattedShiftTemplates = formatShiftTemplatesForCalendar(response.data);
        this.setState({ shiftTemplates: formattedShiftTemplates });
      } else {
        // Handle case where response is not an array
        console.error('Response is not an array', response.data);
        console.log()
        this.setState({ shiftTemplates: [] });
      }
    } catch (error) {
      alert('Failed to fetch shift templates: ' + error.message);
      console.log(error);
      this.setState({ shiftTemplates: [] }); // Reset to empty array on error
    }
  }
  

  handlePositionSelect = (event) => {
    this.setState({ selectedPositionId: event.target.value });
  }

  render() {
    return (
      <div className='demo-app'>
        {this.FilterBar()}
        <div className='demo-app-main'>
        <img src={logo} alt="sched logo" className="logo"></img>
        <img className="profile-button" src={profile} alt="Profile Button" onClick={this.openModal} />
        <Modal isOpen={this.state.showModal} onRequestClose={this.closeModal}>
            <button onClick={this.handleSignOut}>Sign Out</button>
            <button onClick={this.handleEditProfile}>Edit Profile</button>
          </Modal>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            allDaySlot={false}
            height={520}
            scrollTime={"09:00:00"}
            initialView='timeGridWeek'
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={this.state.weekendsVisible}
            initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
            select={this.handleDateSelect}
            eventContent={renderEventContent} // custom render function
            eventClick={this.handleEventClick}
            eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
            events={this.state.shiftTemplates}
            /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
          />
        </div>
      </div>
    )
  }

  // Login as empployee
  // Call get JWT API
  // Save empployee object (whole thing) in a JWT
  // Gets shifts by managerID

  // Login as mangager


  // Gets shifts by manager


  // Add FilterBar here
  FilterBar() {
    return (
      <div>
        {this.renderPositionSelect()}
      </div>
    )
  }

  handleWeekendsToggle = () => {
    this.setState({
      weekendsVisible: !this.state.weekendsVisible
    })
  }

  handleDateSelect = async (selectInfo) => {
    let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title && this.state.selectedPositionId) {
      const event = {
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      };

      try {
        const jwtToken = localStorage.getItem('token');
        console.log(convertToStandardTime(selectInfo.startStr));
        console.log(convertToStandardTime(selectInfo.endStr));
        console.log(getDayOfWeek(selectInfo.startStr));
        const response = await axios.post('http://localhost:3000/api/shift-templates', {
          dayOfWeek: getDayOfWeek(selectInfo.startStr), // convert startStr to day of week
          startTime: convertToStandardTime(selectInfo.startStr),
          endTime: convertToStandardTime(selectInfo.endStr),
          positionId: this.state.selectedPositionId, // you will need to get the positionId as required by your API
          managerId: localStorage.getItem('id')
        }, {
          headers: {
            Authorization: `Bearer ${jwtToken}`
          }

        });

        calendarApi.addEvent(event);
        alert('New shift template created!');
      } catch (error) {
        alert(error);
      }
      
      

      const empId = localStorage.getItem('id');
      const templateId = 'TEMPLATE_ID';
      const date = formatDate(event.start, { year: 'numeric', month: '2-digit', day: '2-digit' });
    } else {
      alert('You must select a position first.');
    }
  }

  handleEventClick = (clickInfo) => {
    if (window.confirm(`Are you sure you want to delete the event "${clickInfo.event.title}"`)) {
      clickInfo.event.remove();
    }
  };

  handleEvents = (events) => {
    this.setState({
      currentEvents: events
    })
  }

}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}

function renderSidebarEvent(event) {
  return (
    <li key={event.id}>
      <b>{formatDate(event.start, {year: 'numeric', month: 'short', day: 'numeric'})}</b>
      <i>{event.title}</i>
    </li>
  )
}

function convertToStandardTime(timeString) {
  // Extract the time part before the timezone offset
  const timePart = timeString.split('T')[1].split('-')[0];
  
  // Extract the hours and minutes
  const hoursAndMinutes = timePart.split(':').slice(0, 2).join(':');
  
  return hoursAndMinutes;
}

function getDayOfWeek(dateString) {
  // Create a new Date object from the date string
  const date = new Date(dateString);

  // Get the day of the week from the date object
  const dayOfWeek = date.getDay();

  return dayOfWeek;
}

// Function to format shift templates into FullCalendar events
function formatShiftTemplatesForCalendar(shiftTemplates) {
  return shiftTemplates.map(template => {
    // Assuming your template has properties like `startTime`, `endTime`, `title`
    return {
      id: template._id, // or some unique identifier from your template
      title: template.title,
      start: formatDateTimeForCalendar(template.startTime),
      end: formatDateTimeForCalendar(template.endTime),
      // Include other relevant properties
    };
  });
}

// Helper function to format date/time for FullCalendar
function formatDateTimeForCalendar(dateTime) {
  // Format the dateTime string as needed for the calendar
  // Example: "2023-11-10T09:00:00" (if your API returns date and time separately, you may need to concatenate them)
  return dateTime;
}