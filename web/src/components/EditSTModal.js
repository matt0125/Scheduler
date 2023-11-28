import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import ScrollableList from './ScrollableList';
import { List, ListItem, ListItemText, Button, ListSubheader } from '@mui/material';
import axios from 'axios';

function EditSTModal({ onAction, positionId, isOpen, date, empId, templateId, template }) {
    const [selectedItemIds, setSelectedItemIds] = useState([]);
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchEmployeesByPosition();
        }
    }, [isOpen, positionId]);

    const fetchEmployeesByPosition = async () => {
        try {
            console.log("Position ID is: " + positionId);
            console.log("Employee ID is: " + empId);
            console.log("Template ID is: " + templateId);
            console.log("Date is: " + convertDate(template._instance.range.start));
            // Retrieve the authorization token from local storage
            const token = localStorage.getItem('token');
    
            // Make the request using Axios
            const response = await axios.get(`http://large.poosd-project.com/api/employee/position/${positionId}`, {
                headers: {
                    ContentType: 'application/json', // Tell the server we are sending this over as JSON
                    Authorization: `Bearer ${token}` // Add the token to the Authorization header
                }
            });
    
            // Assuming the response data structure has an 'employees' field
            setEmployees(response.data.employees);
            console.log(response.data.employees);
        } catch (error) {
            console.error('Error fetching employees:', error);
            // Handle error state as needed
        }
    };

    const handleAssignShiftButtonClick = () => {
        if(selectedItemIds.length > 0) {
          assignShifts(selectedItemIds);
        } else {
            alert("None selected!");
        }
    };

    const assignShifts = async (selectedItemIds) => {
        // TODO: implement this
        console.log("assigning shift");
        console.log(selectedItemIds);
        

        const token = localStorage.getItem('token');

        // Setting up the Axios configuration for the POST request
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        for (let id of selectedItemIds) {
            try {
                const postData = {
                    date: convertDate(template._instance.range.start),
                    empId: id,
                    templateId: templateId
                };
    
                const response = await axios.post('http://large.poosd-project.com/api/shifts', postData, config);
                console.log(`Shift assigned to employee ${id}:`, response.data);
            } catch (error) {
                console.error(`Error assigning shift to employee ${id}:`, error);
            }
        }

    }

    return (
        <div className='editSTModal'>
            <h3>Assign Shift Template</h3>
            <ScrollableList items={employees} selectedItemIds={selectedItemIds} setSelectedItemIds={setSelectedItemIds} />
            <Button
                variant="contained" 
                color="primary" 
                onClick={handleAssignShiftButtonClick} 
                disabled={selectedItemIds.length === 0}
            >
                Assign Employee to Shift
            </Button>
        </div>
    );
}

function convertDate(dateString) {
    // Parse the input date string
    const date = new Date(dateString);

    // Extract the month, day, and year
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();
    let year = date.getFullYear().toString();

    // Ensure month and day are in MM and DD format
    month = month.length === 1 ? '0' + month : month;
    day = day.length === 1 ? '0' + day : day;

    // Return the formatted date string
    return `${month}-${day}-${year}`;
}

export default EditSTModal;
