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
import EditSTModal from '../components/EditSTModal';

// Define your color choices here based on the image provided
const colorChoices = ['#bdccb8', '#b9c4cc', '#eb7364', '#ef9a59', '#f4c7bc' , '#cbdef0', '#eac8dd', '#f8edce', '#fefebd', '#c7b7cc', '#f7d09c', '#bbaff6'];


export default class DemoApp extends React.Component {
  state = {
    weekendsVisible: true,
    currentEvents: [],
    positions: [], // To store the list of positions
    selectedPositionId: null, // To store the selected position ID
    showPorfileModal: false,  // Add this line
    showEditSTModal: false,
    shiftTemplates: [],
    selectMirrorEnabled: true,
  }
   // Function to handle opening the modal
   openProfileModal = () => {
    this.setState({ showPorfileModal: true });
  }

  // Function to handle closing the modal
  closeProfileModal = () => {
    this.setState({ showPorfileModal: false });
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
  
  openEditSTModal = () => {
    this.setState({ showEditSTModal: true });
  }

  closeEditSTModal = () => {
    this.setState({ showEditSTModal: false });
  }


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
        this.setState({ selectMirrorEnabled: false });
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

  handleDateClick = () => {
    // Enable selectMirror when starting selection
    this.setState({ selectMirrorEnabled: true });
  };

  // Trying to get Emmployee info and use it in forms using get Employee API
  handleProfileFormOpen = async () => {
    this.setState({
      isOpen: true,
    });
  
    try {
      let jwtToken = localStorage.getItem('token');
      const response = await axios.get('http://large.poosd-project.com/api/employee/', {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      alert('Employee GOT!');
    } catch (error) {
      alert(error);
    }
  };
  

  handleProfileFormClose = () => {
    this.setState({
      isOpen: false,
    });
  };
  

  render() {
    return (
      <div className='demo-app'>
        {this.FilterBar()}
        <div className='demo-app-main'>
        <img src={logo} alt="sched logo" className="logo"></img>
        <img className="profile-button" src={profile} alt="Profile Button" onClick={this.openProfileModal} />
        <Modal isOpen={this.state.showPorfileModal} onRequestClose={this.closeProfileModal}>
            <button onClick={this.handleSignOut}>Sign Out</button>
            <button onClick={this.handleEditProfile}>Edit Profile</button>
        </Modal>
        <Modal 
          isOpen={this.state.showEditSTModal} 
          onRequestClose={this.closeEditSTModal}
        > 
            <EditSTModal isOpen={this.state.showEditSTModal} />
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
            eventContent={this.renderEventContent} // custom render function
            eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
            dateClick={this.handleDateClick}
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
l
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
    // Disable selectMirror temporarily
    let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title && this.state.selectedPositionId) {
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

        // full calendar creation
        const event = {
          id: createEventId(),
          title: response,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay
        };

        // calendarApi.addEvent(event);
        alert('New shift template created!');
        alert('Fetching events!');
        this.fetchShiftTemplates();
      } catch (error) {
        alert(error);
      }
      
      

      // const empId = localStorage.getItem('id');
      // const templateId = 'TEMPLATE_ID';
      // const date = formatDate(event.start, { year: 'numeric', month: '2-digit', day: '2-digit' });
    } else {
      alert('You must select a position first.');
    }
  }

  handleEvents = (events) => {
    this.setState({
      currentEvents: events
    })
  }

  // Make this be able to add employees to shift temmplates 
  handleEventDelete = (clickInfo) => {
    alert(typeof clickInfo);
    if (window.confirm(`Are you sure you want to delete the event "${clickInfo.title}"`)) {
      alert(clickInfo.id);
      const eventId = clickInfo.id.split('-')[0]; // Extract original template ID
      const url = `http://large.poosd-project.com/api/shift-templates/${eventId}`;

      // Retrieve the JWT from local storage
      const jwtToken = localStorage.getItem("token");

      axios.delete(url, {
        headers: {
            Authorization: `Bearer ${jwtToken}`,
            contentType: 'application/json'
        }
      })
      .then(response => {
        // Filter out deleted events
        const updatedShiftTemplates = this.state.shiftTemplates.filter(event => !event.id.startsWith(`${eventId}-`));
        this.setState({ shiftTemplates: updatedShiftTemplates });
    
        alert("Event deleted successfully.");
      })
      .catch(error => {
        console.error('Error:', error);
        alert("Failed to delete the event: " + error);
      });
    }
  };
  
  handleEventEdit = (clickInfo) => {
    this.openEditSTModal();
  };

  renderEventContent = (eventInfo) => {
    return (
      <div>
        <b style={{ color: '#47413d' }}>{eventInfo.timeText}</b>
        <i style={{ color: '#47413d' }}>{eventInfo.event.title}</i>
        <button
          className="event-edit-button"
          onClick={() => this.handleEventEdit(eventInfo.event)}
          aria-label="Edit event"
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', marginRight: '5px' }}
        >
          ✏️
        </button>
        <button
          className="event-delete-button"
          onClick={() => this.handleEventDelete(eventInfo.event)}
          aria-label="Delete event"
          style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
        >
          🗑️
        </button>
      </div>
    )
  }
  


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

let colorIndex = 0;
function getNextColor() {
  const color = colorChoices[colorIndex];
  colorIndex = (colorIndex + 1) % colorChoices.length; // Move to the next color or wrap around
  return color;
}

// Shift templatese now can be shown for 12 week, We can change this number if we want
async function formatShiftTemplatesForCalendar(shiftTemplates, numberOfWeeks = 12) {
  const formattedTemplates = [];
  const positionColors = {}; // Object to store colors for positions

  for (const template of shiftTemplates) {
    const positionId = template.positionId;

    // Assign a color to the position if not already assigned
    if (!positionColors[positionId]) {
      positionColors[positionId] = getNextColor();
    }

    const title = await getPositionTitle(positionId);

    // Loop over the number of weeks
    for (let week = 0; week < numberOfWeeks; week++) {
      const startDateTime = getNextFormattedDateForDayOfWeek(template.dayOfWeek, template.startTime, week);
      const endDateTime = getNextFormattedDateForDayOfWeek(template.dayOfWeek, template.endTime, week);

      formattedTemplates.push({
        id: `${template._id}-${week}`, // Unique ID for each event
        title: title,
        start: startDateTime,
        end: endDateTime,
        color: positionColors[positionId] // Assign the color to the event
      });
    }
  }

  return formattedTemplates;
}

function getNextFormattedDateForDayOfWeek(dayOfWeek, time, weekOffset = 0) {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 7 * weekOffset + dayOfWeek);

  // Set the current date to the nearest past Sunday
  currentDate.setDate(currentDate.getDate() - currentDate.getDay());

  // Calculate the date for the target dayOfWeek
  currentDate.setDate(currentDate.getDate() + dayOfWeek);

  // Parse the time
  const [hours, minutes] = time.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) {
    throw new Error('Invalid time format');
  }

  // Set the time
  currentDate.setHours(hours, minutes, 0); // Setting seconds to 0

  // Format the date in YYYY-MM-DDTHH:MM:SS format
  // Adjusting for local timezone offset
  const timezoneOffset = currentDate.getTimezoneOffset() * 60000; // offset in milliseconds
  const localDate = new Date(currentDate.getTime() - timezoneOffset);
  let formattedDate = localDate.toISOString().replace(/:\d{2}\.\d{3}Z$/, '');

  return formattedDate;
}


// Example usage
console.log(getNextFormattedDateForDayOfWeek(2, '15:30'));

