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
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';


export default class DemoApp extends React.Component {
  state = {
    weekendsVisible: true,
    currentEvents: [],
    isOpen: false
  }

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
        <img
          src={profile}
          alt="Profile Button"
          className="profile-button"
          onClick={this.handleProfileFormOpen}
        />

        <Modal show={this.state.isOpen} onHide={this.handleProfileFormClose}>
          <Modal.Header>
            <Modal.Title>Profile Form</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <input type="text" placeholder="Name" />
              <input type="email" placeholder="Email" />
              <button type="submit">Submit</button>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <button type="button" onClick={this.handleProfileFormClose}>
              Close
            </button>
          </Modal.Footer>
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

    if (title) {
      const event = {
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      };

      try {
        const jwtToken = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3000/api/shift-templates', {
          dayOfWeek: 5, // convert startStr to day of week
          startTime: "8:00",
          endTime: "10:30",
          positionId: "6540314729a02a019abee6e6" // you will need to get the positionId as required by your API
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
