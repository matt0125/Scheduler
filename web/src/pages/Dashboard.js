import React from 'react';
//Importing Calendar Modules
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
class Home extends React.Component {
    
 
  render() {
   
    return (
     
      <div className="container p-5">
           <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    droppable={true}
                    editable={true}
                    selectable={true}
                    initialView='dayGridMonth'
                    customButtons={{
                        myCustomButton: {
                          text: 'Custom Button!',
                          click: function() {
                            alert('clicked the custom button!');
                          },
                        },
                      }}
                    headerToolbar={{
                      start: 'title', // will normally be on the left. if RTL, will be on the right
                      center: 'today myCustomButton',
                      end: 'prev,next', // will normally be on the right. if RTL, will be on the left
                    }}
                   
                    events={[
                      { title: 'event 1', date: '2023-10-08' },
                      { title: 'event 2', date: '2023-10-10' },
                    ]}
                  />
      </div>
)
};
}
export default Home;