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
    console.log("Startup: ",this.state.shiftTemplates);
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
      console.log(managerId);
      const response = await axios.get(`http://localhost:3000/api/shift-templates/manager/${managerId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          contentType: 'application/json'
        }
      });
  
      // Check if the response is an array
      if (Array.isArray(response.data)) {
        console.log("response data is ", response.data);
        const formattedShiftTemplates = await formatShiftTemplatesForCalendar(response.data);
        console.log("formatted shift template:", formattedShiftTemplates);
        this.setState({ shiftTemplates: formattedShiftTemplates });
      } else {
        // Handle case where response is not an array
        console.error('Response is not an array', response.data);
        console.log()
        this.setState({ shiftTemplates: [] });

      }
      // calendarApi = selectInfo.view.calendar;
      // console.log("this is being added: ", shiftTemplates[0]);
      // calendarApi.addEvent(shiftTemplates[0])
    } catch (error) {
      alert('Failed to fetch shift templates: ' + error.message);
      console.log(error);
      this.setState({ shiftTemplates: [] }); // Reset to empty array on error
    }
    console.log("After startup: ", this.state.shiftTemplates);
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
            events={this.state.shiftTemplates} // alternatively, use the `events` setting to fetch from a feed
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



// Helper function to format date/time for FullCalendar
function formatDateTimeForCalendar(dateTime) {
  // Format the dateTime string as needed for the calendar
  // Example: "2023-11-10T09:00:00" (if your API returns date and time separately, you may need to concatenate them)
  return dateTime;
}

async function getPositionTitle(positionId) {
  // Define the base URL
  const baseUrl = 'http://localhost:3000/api/position/';

  // Append the positionId to the URL
  const url = `${baseUrl}${positionId}`;

  // Retrieve the JWT token from local storage
  const jwtToken = localStorage.getItem('token');

  console.log("Position ID is:", positionId);

  // Make a GET request using Axios
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      contentType: 'application/json'
    }
  })
    .then(response => {
      // Handle success: extract and return the position title from the response
      return response.data.name; // Assuming the title is directly in the response data
    })
    .catch(error => {
      // Handle error
      console.error('Error fetching position title:', error);
      return "error fetching position"; // Rethrow or handle the error as needed
    });
}



async function formatShiftTemplatesForCalendar(shiftTemplates) {
  const formattedTemplates = [];

  for (const template of shiftTemplates) {
    const title = await getPositionTitle(template.positionId);

    // No need to call toISOString again as getNextFormattedDateForDayOfWeek already returns an ISO string
    const startDateTime = await getNextFormattedDateForDayOfWeek(template.dayOfWeek, template.startTime);
    const endDateTime = await getNextFormattedDateForDayOfWeek(template.dayOfWeek, template.endTime);

    formattedTemplates.push({
      id: template._id,
      title: title, // title fetched from getPositionTitle
      start: startDateTime,
      end: endDateTime,
    });
  }

  return formattedTemplates;
}


function getNextFormattedDateForDayOfWeek(dayOfWeek, time) {

  const targetDay = dayOfWeek;
  if (targetDay === undefined) {
      throw new Error('Invalid day of the week');
  }

  // Parse the time
  const [hours, minutes] = time.split(':').map(Number);
  console.log(hours, minutes);
  if (isNaN(hours) || isNaN(minutes)) {
      throw new Error('Invalid time format');
  }

  // Get the current date and time
  const currentDate = new Date();
  console.log("date ", currentDate);
  console.log("date ", currentDate.getDay());
  console.log(targetDay);

  // Calculate the difference between the current day and the target day
  let dayDifference = targetDay - currentDate.getDay();
  if (dayDifference < 0) {
      // If target day is in the past of the current week, move to the next week
      dayDifference += 7;
  }
  console.log("diff", dayDifference);

  // Set the date to the next occurrence of the target day
  currentDate.setDate(currentDate.getDate() + dayDifference);
  console.log("date ", currentDate);

  // Set the time
  currentDate.setHours(hours, minutes, 0); // Setting seconds to 0
  console.log("date ", currentDate);

  // Format the date in YYYY-MM-DDTHH:MM:SS format
  // Adjusting for local timezone offset
  const timezoneOffset = currentDate.getTimezoneOffset() * 60000; // offset in milliseconds
  console.log("offset ", timezoneOffset);
  const localDate = new Date(currentDate.getTime() - timezoneOffset);
  console.log("local date", localDate);
  let formattedDate = localDate.toISOString().replace(/:\d{2}\.\d{3}Z$/, '');

  return formattedDate;
}

// Example usage
console.log(getNextFormattedDateForDayOfWeek(2, '15:30'));

