import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import ScrollableList from './ScrollableList';
import { List, ListItem, ListItemText, Button, ListSubheader } from '@mui/material'

function EditSTModal({ onAction, positionId, isOpen }) {
    const [selectedItemIds, setSelectedItemIds] = useState([]);
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchEmployeesByPosition();
        }
    }, [isOpen, positionId]);

    const fetchEmployeesByPosition = async () => {
        try {
            const response = await fetch(`/api/employees/position/${positionId}`); // Update this URL to your API endpoint
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setEmployees(data.employees); // Assuming the response has an 'employees' field
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
        console.log("assigning shift");
        console.log(selectedItemIds);
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

export default EditSTModal;
