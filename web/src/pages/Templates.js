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
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import EditSTModal from '../components/EditSTModal';
import PositionList from '../components/PositionList';
import EmployeeList from '../components/EmployeeList'; // Adjust the path as needed
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TopBarComponent from '../components/topBar'

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


// Define your color choices here based on the image provided
const colorChoices = ['#bdccb8', '#b9c4cc', '#eb7364', '#ef9a59', '#f4c7bc' , '#cbdef0', '#eac8dd', '#f8edce', '#fefebd', '#c7b7cc', '#f7d09c', '#bbaff6'];

const getNextAvailableColor = (positionColors) => {
  const usedColors = new Set(Object.values(positionColors));
  const availableColors = colorChoices.filter(color => !usedColors.has(color));
  return availableColors.length > 0 ? availableColors[0] : null; // return null or a default color if all are used
};


export default class DemoApp extends React.Component {
  state = {
    weekendsVisible: true,
    currentEvents: [],
    positions: [], // To store the list of positions
    selectedPositionId: null, // To store the selected position ID
    showProfileModal: false,  // Add this line
    showEditSTModal: false,
    shiftTemplates: [],
    selectMirrorEnabled: true,
    selectedShiftTemplateId: null,
    shiftTemplatePositionId: null, // For storing the position ID of the shift template being edited, NOT created
    selectedShiftTemplate: null,
    showPositionModal: false,
    showEmployeeList: false,
  }

  // Method to toggle the list view
  toggleList = () => {
    this.setState(prevState => ({
      showEmployeeList: !prevState.showEmployeeList,
    }));
  };
  
  openEditSTModal = (id) => {
    this.setState({ showEditSTModal: true });
    this.setState({ shiftTemplatePositionId: id });
  }

  closeEditSTModal = () => {
    this.setState({ showEditSTModal: false });
  }


  componentDidMount() {
    this.fetchPositions();
    console.log("Startup: ",this.state.shiftTemplates);
  }

  renderPositionSelect() {
    return (
      <FormControl fullWidth>
        <InputLabel id="position-select-label">Position</InputLabel>
        <Select
          labelId="position-select-label"
          value={this.state.selectedPositionId || ''}
          onChange={(event) => this.handlePositionSelect(event)} // Update this line
          label="Position"
        >
          <MenuItem value=""><em>None</em></MenuItem>
          {this.state.positions.map((position) => (
            <MenuItem key={position.id} value={position.id}>
              {position.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
  
  
  

  fetchPositions = async () => {
    const managerId = localStorage.getItem('id');
    const jwtToken = localStorage.getItem('token');
    
    try {
      const response = await axios.get(`http://large.poosd-project.com/api/positions/${managerId}`, {
        headers: {
          contentType: 'application/json',
          Authorization: `Bearer ${jwtToken}`
        }
      });
  
      let positionColors = JSON.parse(localStorage.getItem('positionColors')) || {};
      let colorIndex = 0;
  
      const positionsWithIdsAndColors = response.data.positions.map(position => {
        if (!positionColors[position._id]) {
          positionColors[position._id] = getNextAvailableColor(positionColors); // Use the utility function
        }
        return {
          id: position._id,
          name: position.name,
          color: positionColors[position._id],
          checked: false
        };
      });
      
      localStorage.setItem('positionColors', JSON.stringify(positionColors));
      this.setState({ 
        positions: positionsWithIdsAndColors,
        colorsLoaded: true  // New state property to track when colors are loaded
      }, () => {
        this.fetchShiftTemplates(); // Fetch templates after positions and colors are set
      });
    } catch (error) {
      console.error('Failed to fetch positions:', error);
    }
  }
  
  
  
  

  fetchShiftTemplates = async () => {
    const managerId = localStorage.getItem('id');
    const jwtToken = localStorage.getItem('token');
  
    try {
      console.log(managerId);
      const response = await axios.get(`http://large.poosd-project.com/api/shift-templates/manager/${managerId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          contentType: 'application/json'
        }
      });
  
      // Check if the response is an array
      if (Array.isArray(response.data.shiftTemplates)) {
        console.log("response data is ", response.data);
        const formattedShiftTemplates = await formatShiftTemplatesForCalendar(response.data.shiftTemplates);
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
    const selectedId = event.target.value;
    console.log('Selected position ID:', selectedId); // Should log the selected position's ID
  
    if (selectedId) {
      this.setState({ selectedPositionId: selectedId });
    } else {
      console.log('No position ID found');
    }
  };
  

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

  renderPositionModal() {
    return (
      <Modal 
        isOpen={this.state.showPositionModal} 
        onRequestClose={() => this.setState({ showPositionModal: false })}
        // Add any additional modal properties you need
      >
        {this.renderPositionSelect()}
        <button onClick={() => this.handlePositionSubmit()}>Submit</button>
      </Modal>
    );
  }

  handlePositionSubmit = () => {
    this.handleDateSelect(this.state.selectInfo);
    this.setState({ showPositionModal: false });
  }

  // Adds position to manager
  addPosition = async (positionName) => {
    const jwtToken = localStorage.getItem('token');
    const managerId = localStorage.getItem('id');
    let positionColors = JSON.parse(localStorage.getItem('positionColors')) || {};
  
    try {
      const response = await axios.post(`http://large.poosd-project.com/api/positions/manager`, {
        name: positionName,
        managerId: managerId
      }, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        },
      });
  
      // Accessing the _id from the newPosition object in the response
      if (response.data && response.data.newPosition && response.data.newPosition._id) {
        const newPositionColor = getNextAvailableColor(positionColors);
        if (newPositionColor) {
          positionColors[response.data.newPosition._id] = newPositionColor;
          localStorage.setItem('positionColors', JSON.stringify(positionColors));
        }
        this.fetchPositions(); // Refresh the positions list
      } else {
        throw new Error('Position data is not in the expected format.');
      }
    } catch (error) {
      console.error('Failed to add position:', error);
      alert('Failed to add position: ' + error.message);
    }
  };
  
  
  // Deletes position connected to manager
  deletePosition = async (positionId) => {
    const jwtToken = localStorage.getItem('token');
  
    try {
        // Then, delete all shift templates associated with this position
      await axios.delete(`http://large.poosd-project.com/api/shift-templates/position/${positionId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        },
      });
      await axios.delete(`http://large.poosd-project.com/api/position/${positionId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        },
      });
  
      // Use the callback form of setState to ensure the state updates correctly
      this.setState(prevState => ({
        positions: prevState.positions.filter(position => position.id !== positionId),
      }), () => {
        // Callback to ensure the state is updated before fetching templates
        this.fetchShiftTemplates();
      });
  
    } catch (error) {
      alert('Failed to delete position: ' + error.message);
      console.error(error);
    }
  };

  togglePosition = (positionId) => {
    this.setState(prevState => ({
      positions: prevState.positions.map(position => {
        if (position.id === positionId) {
          return { ...position, checked: !position.checked };
        }
        return position;
      }),
    }));
  };

  handleEventClick = (clickInfo) => {
    // Handle event click action
    console.log('Event clicked:', clickInfo.event);
    // Set the clicked event details in the state and open the modal
    this.setState({ selectedEvent: clickInfo.event, showEventModal: true });
  };
  
  closeEventModal = () => {
    this.setState({ showEventModal: false });
  };

  getDayOfWeek = (dateString) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    const dayOfWeek = daysOfWeek[date.getDay()];
    return dayOfWeek;
  };
  

  render() {
    const { showEmployeeList, positions } = this.state;
    const { showEventModal, selectedEvent } = this.state;

    // Only render the calendar if colors are loaded
      if (!this.state.colorsLoaded) {
        return <div>Loading...</div>; // Or a spinner, or some other loading indicator
      }
    return (
      <div className='demo-app'>
        {this.renderPositionModal()}
        <div className='demo-app-main'>
        <TopBarComponent/>
        <Modal 
          isOpen={this.state.showEditSTModal} 
          onRequestClose={this.closeEditSTModal}
        > 
          <EditSTModal 
            isOpen={this.state.showEditSTModal} 
            positionId={this.state.shiftTemplatePositionId}
            templateId={this.state.selectedShiftTemplateId}
            empId={localStorage.getItem('id')}
            template={this.state.selectedShiftTemplate}
          />
        </Modal>
        <Modal
          isOpen={showEventModal}
          onRequestClose={this.closeEventModal}
          ariaHideApp={false}
          contentLabel="Event Modal"
          // Additional modal settings
          style={{
            content: {
              position: 'relative',
            },
          }}
        >
          {selectedEvent && (
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <button
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                  }}
                  onClick={this.closeEventModal}
                >
                  &#10006;
                </button>
              </div>
              <div style={{ marginBottom: '20px' }}>
                {/* Vertical spacer */}
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <h2 style={{ flex: 1 }}>
                  {selectedEvent.title !== 'undefined' && selectedEvent.title !== null
                    ? selectedEvent.title.replace(/\b\w/g, (char) => char.toUpperCase())
                    : 'No Position'}
                </h2>
                <div>
                  <EditIcon
                    className="event-edit-button"
                    onClick={() => {
                      this.closeEventModal();
                      this.handleEventEdit(selectedEvent);
                    }}
                    aria-label="Edit event"
                    style={{ cursor: 'pointer', marginRight: '5px', fontSize: '24px' }}
                  />
                  <DeleteIcon
                    className="event-delete-button"
                    onClick={() => {
                      this.closeEventModal();
                      this.handleEventDelete(selectedEvent);
                    }}
                    aria-label="Delete event"
                    style={{ cursor: 'pointer', fontSize: '24px' }}
                  />
                </div>
              </div>
              <p>
                {this.getDayOfWeek(selectedEvent.start)}: {new Date(selectedEvent.start).toLocaleTimeString([], { timeStyle: 'short' })} -{' '}
                {new Date(selectedEvent.end).toLocaleTimeString([], { timeStyle: 'short' })}
              </p>
            </div>
          )}
        </Modal>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: '',
            center: '',
            right: ''
          }}
          views={{
            timeGridWeek: {
              dayHeaderFormat: { weekday: 'long' } // This will show full day names (e.g., "Monday") without dates
            }
          }}
          allDaySlot={false}
          height={'65vh'}
          scrollTime={"09:00:00"}
          initialView='timeGridWeek'
          editable={false}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekday= {'long'}
          weekends={this.state.weekendsVisible}
          events={this.state.shiftTemplates} // alternatively, use the `events` setting to fetch from a feed
          select={this.triggerHandleDateSelect}
          eventContent={this.renderEventContent} // custom render function
          eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
          dateClick={this.handleDateClick}
          slotEventOverlap={false} // Set to 'false' to add padding between events
          eventClick={this.handleEventClick}
        />
        <div className='demo-app-sidebar'>
          
          {showEmployeeList ? (
            <EmployeeList
              managerId={localStorage.getItem('id')}
              onDeleteEmployee={this.deleteEmployee} // Implement this method
            />
          ) : (
            <PositionList
              positions={positions}
              onToggle={this.togglePosition}
              onAddPosition={this.addPosition}
              onDeletePosition={this.deletePosition}
            />
          )}
        </div>
        </div>
      </div>
    )
  }


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

  triggerHandleDateSelect = (selectInfo) => {
    // You can add additional logic here if needed
    this.setState({ selectInfo, showPositionModal: true });
  }

  handleDateSelect = async (selectInfo) => {
    // Disable selectMirror temporarily
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (this.state.selectedPositionId) {
      try {
        const jwtToken = localStorage.getItem('token');
        console.log(convertToStandardTime(selectInfo.startStr));
        console.log(convertToStandardTime(selectInfo.endStr));
        console.log(getDayOfWeek(selectInfo.startStr));
        const response = await axios.post('http://large.poosd-project.com/api/shift-templates', {
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
    if (window.confirm(`Are you sure you want to delete the event "${clickInfo.title}"`)) {
      console.log(clickInfo.id);
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
    console.log("The clikc info is: ", clickInfo);
    this.setState({ selectedShiftTemplateId: clickInfo.id.substring(0,24) });
    this.setState({ selectedShiftTemplate: clickInfo});
    this.openEditSTModal(clickInfo._def.extendedProps.positionId.substring(0, 24));
  };

  renderEventContent = (eventInfo) => {
    return (
      <div>
        {/* <b style={{ color: '#47413d' }}>{eventInfo.timeText}</b>
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
        </button> */}
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
  const baseUrl = 'http://large.poosd-project.com/api/position/';

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
async function formatShiftTemplatesForCalendar(shiftTemplates, numberOfWeeks = 2) {
  const formattedTemplates = [];
  const positionColors = JSON.parse(localStorage.getItem('positionColors')) || {};

  for (const template of shiftTemplates) {
    const positionId = template.positionId._id; 
    const title = template.positionId.name;

    const startDateTime = getNextFormattedDateForDayOfWeek(template.dayOfWeek, template.startTime);
    const endDateTime = getNextFormattedDateForDayOfWeek(template.dayOfWeek, template.endTime);

    formattedTemplates.push({
      id: `${template._id}`,
      title: title,
      start: startDateTime,
      end: endDateTime,
      color: positionColors[positionId] || '#000000', // Default color if not found
      positionId: positionId
    });
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