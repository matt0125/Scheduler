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

export default class DemoApp extends React.Component {
  state = {
    weekendsVisible: true,
    currentEvents: [],
    positions: [], // To store the list of positions
    selectedPositionId: null, // To store the selected position ID
    showModal: false  // Add this line
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
    this.props.history.push('/'); // Redirect to Login.js
  }

  // Function to handle edit profile - placeholder for now
  handleEditProfile = () => {
    // Placeholder function
  }

  componentDidMount() {
    this.fetchPositions();
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
          positionId: this.state.selectedPositionId // you will need to get the positionId as required by your API
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
