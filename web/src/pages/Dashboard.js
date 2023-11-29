import React from 'react'
import { formatDate } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from './event-utils'
import "../styles/Dashboard.css";
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

import { fetchManager } from '../services/api'; 
import { fetchPositions } from '../services/api'; 
import TopBarComponent from '../components/navBar'


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
    shifts: [],
    selectMirrorEnabled: true,
    selectedShiftTemplateId: null,
    shiftTemplatePositionId: null, // For storing the position ID of the shift template being edited, NOT created
    selectedShiftTemplate: null,
    showPositionModal: false,
    showEmployeeList: false,
    showEventModal: false,
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

  closeEventModal = () => {
    this.setState({ showEventModal: false });
  }


  componentDidMount() {
    this.populatePositionsAndColors();
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
  

  populatePositionsAndColors = async () => {
    const jwtToken = localStorage.getItem('token');
    
    try {
      const positions = await fetchPositions();
      
      let positionColors = JSON.parse(localStorage.getItem('positionColors')) || {};
      let colorIndex = 0;
  
      const positionsWithIdsAndColors = positions.map(position => {
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
        // this.fetchShifts(); // Fetch templates after positions and colors are set
      });
    } catch (error) {
      console.error('Failed to fetch positions:', error);
    }
  }
  

  fetchShifts = async (startDate = null, endDate = null) => {
    const managerId = localStorage.getItem('id');
    const jwtToken = localStorage.getItem('token');
  
    try {
      let formattedStartDate = startDate;
      let formattedEndDate = endDate;
  
      if (!startDate || !endDate) {
        // If startDate or endDate is null, get shifts for this week (from this Sunday to this Saturday)
        const today = new Date();
        const sunday = new Date(today);
        sunday.setDate(today.getDate() - today.getDay());
        
        const saturday = new Date(today);
        saturday.setDate(today.getDate() + (6 - today.getDay()));
  
        const format = (date) => {
          const month = date.getMonth() + 1;
          const day = date.getDate();
          const year = date.getFullYear();
          return `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}-${year}`;
        };
  
        formattedStartDate = format(sunday);
        formattedEndDate = format(saturday);
      }

  
      const data = {
        empId: managerId,
        startDate: formattedStartDate,
        endDate: formattedEndDate
      };

      const response = await axios.post(`http://large.poosd-project.com/api/shifts/managerbydates`, data, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          contentType: 'application/json'
        },
        validateStatus: function (status) {
          return status === 404 || (status >= 200 && status < 300); // Resolve only for 404 or successful statuses
        }
      });

      if(response.status !== 404) {
        if (Array.isArray(response.data.shifts)) {
          const formattedShifts = await formatShiftsForCalendar(response.data.shifts);
          this.setState({ shifts: formattedShifts });
        } else {
          // Handle case where response is not an array
          console.error('Response.data.shifts is not an array', response.data.shifts);
          this.setState({ shifts: [] });
          this.setState({ selectMirrorEnabled: false });
        }
      }
      else {
        console.log({status: 404, message: response.data.message});
      }
      
    } catch (error) {
      
      console.log(error);
      this.setState({ shifts: [] }); // Reset to empty array on error
    }
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
  
  handleEventClick = (clickInfo) => {
    this.setState({ selectedEvent: clickInfo.event, showEventModal: true });
  };

  // Function to handle closing the modal
  closeEventModal = () => {
    this.setState({ showEventModal: false });
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

  render() {
    const { showEmployeeList, positions } = this.state;
    const { showEventModal, selectedEvent } = this.state;

    // Only render the calendar if colors are loaded
      if (!this.state.colorsLoaded) {
        return <div>Loading...</div>; // Or a spinner, or some other loading indicator
      }

      // used in selectable to create "on the fly" shifts
      const isManager = localStorage.getItem('userRole') === 'Manager';


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
          >
            {selectedEvent && (
              <div>
                <h2>
                  {selectedEvent.title !== 'undefined' && selectedEvent.title !== null
                    ? selectedEvent.title.replace(/\b\w/g, (char) => char.toUpperCase())
                    : 'No Position'}
                </h2>
                <p>{selectedEvent.extendedProps.name}</p>
                <p>Date: {new Date(selectedEvent.start).toLocaleDateString()}</p>
                <p>
                  Time: {new Date(selectedEvent.start).toLocaleTimeString([], { timeStyle: 'short' })} -{' '}
                  {new Date(selectedEvent.end).toLocaleTimeString([], { timeStyle: 'short' })}
                </p>
                <button onClick={this.closeEventModal}>Close</button>
              </div>
            )}
          </Modal>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'timeGridWeek,timeGridDay'
            }}
            allDaySlot={false}
            height={'80vh'}
            scrollTime={"09:00:00"}
            initialView='timeGridWeek'
            editable={false} // Just handles drag and drop that we dont support
            selectable={isManager}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={this.state.weekendsVisible}
            events={this.state.shifts} // alternatively, use the `events` setting to fetch from a feed
            select={this.triggerHandleDateSelect}
            eventContent={this.renderEventContent} // custom render function
            eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
            dateClick={this.handleDateClick}
            eventClick={this.handleEventClick}

            datesSet={this.handleDatesSet}
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
        this.fetchShifts();
      } catch (error) {
        
      }

    } else {
      
    }
  }

  handleEvents = (events) => {
    this.setState({
      currentEvents: events
    })
  }

  renderEventContent = (eventInfo) => {
    const shouldDisplayTitle = eventInfo.event.title && eventInfo.event.title.trim() !== 'undefined';
    const shouldDisplayName = eventInfo.event.extendedProps.name && eventInfo.event.extendedProps.name.trim() !== 'undefined';
    
    const eventStyle = {
      color: '#47413d',
    };
  
    const titleStyle = {
      fontStyle: 'italic',
    };
  
    return (
      <div style={eventStyle}>
        <div>
          <b>{eventInfo.timeText}</b>
        </div>
        {/* {shouldDisplayTitle && (
          <div style={titleStyle}>
            {eventInfo.event.title}
          </div>
        )} */}
        {shouldDisplayName && (
          <div style={titleStyle}>
            {eventInfo.event.extendedProps.name}
          </div>
        )}
      </div>
    );
  }

  handleDatesSet = async (dateInfo) => {
    try {
      const formatToMMDDYYYY = (date) => {
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${month}-${day}-${year}`;
      };
  
      const startDate = dateInfo.start ? formatToMMDDYYYY(dateInfo.start) : null;
      // End date minus one to account for visible dates
      var endDate = dateInfo.end ? formatToMMDDYYYY(new Date (dateInfo.end - (24 * 60 * 60 * 1000))) : null;
  
      await this.fetchShifts(startDate, endDate);
      // Other operations based on visible dates
      // ...
    } catch (error) {
      console.error('Error handling visible dates:', error);
    }
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

async function formatShiftsForCalendar(shifts) {
  const formattedShifts = [];
  const positionColors = JSON.parse(localStorage.getItem('positionColors')) || {};

  for (const shift of shifts) {
    const positionId = shift.templateId?.positionId?._id; 
    const title = shift.templateId?.positionId?.name;

      const startDateTime = `${shift.date.split("T")[0]}T${shift.templateId?.startTime}`;
      const endDateTime = `${shift.date.split("T")[0]}T${shift.templateId?.endTime}`;

      formattedShifts.push({
        id: `${shift.templateId?._id}`,
        title: title,
        name: `${shift.empId.firstName} ${shift.empId.lastName}`,
        start: startDateTime,
        end: endDateTime,
        color: positionColors[positionId] || '#999999', // Default color if not found
        positionId: positionId
      });
  }

  return formattedShifts;
}



function getNextFormattedDateForDayOfWeek(date, time) {
  var formattedDate = `${date.split("T")[0]}T${time}`;
  return formattedDate;
}