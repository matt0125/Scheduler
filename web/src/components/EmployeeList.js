import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const EmployeeList = ({ managerId, onDeleteEmployee }) => {
  const [employeeData, setEmployeeData] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      const jwtToken = localStorage.getItem('token'); 

      try {
        const response = await axios.get(`http://localhost:3000/api/employee/${managerId}`, {
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
          }
        });
        console.log("Employee data:", response.data);
        setEmployeeData(response.data);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    fetchEmployees();
  }, [managerId]);

  const listStyle = {
    maxHeight: '300px',
    overflowY: 'scroll',
    border: '1px solid #ccc',
    padding: 0,
  };

  return (
    <div style={{ margin: '10px', width: '300px' }}>
      <List style={listStyle}>
        {employeeData ? (
          <ListItem key={employeeData._id} dense button>
            <ListItemText 
              primary={`${employeeData.firstName} ${employeeData.lastName}`}
              secondary={employeeData.role} // Update if role is available in a different format
              style={{
                maxWidth: 'calc(100% - 60px)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            />
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => onDeleteEmployee(employeeData._id)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ) : (
          <p>No employee data found.</p>
        )}
      </List>
    </div>
  );
};

export default EmployeeList;
