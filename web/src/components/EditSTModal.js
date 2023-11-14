import React, { useState } from 'react';

function EditSTModal() {
    // State to store the list of employees
    const [employees, setEmployees] = useState([]);

    // State to store the selected employees
    const [selectedEmployees, setSelectedEmployees] = useState([]);

    // Function to handle adding a new employee
    const addEmployee = () => {
        const newEmployee = prompt("Enter the name of the new employee:");
        if (newEmployee) {
            setEmployees([...employees, newEmployee]);
        }
    };

    // Function to handle selection
    const handleSelect = (employee) => {
        if (selectedEmployees.includes(employee)) {
            setSelectedEmployees(selectedEmployees.filter(e => e !== employee));
        } else {
            setSelectedEmployees([...selectedEmployees, employee]);
        }
    };

    return (
        <div>
            <h1>Edit Staff</h1>
            <ul>
                {employees.map((employee, index) => (
                    <li key={index} onClick={() => handleSelect(employee)} 
                        style={{ cursor: 'pointer', color: selectedEmployees.includes(employee) ? 'blue' : 'black' }}>
                        {employee}
                    </li>
                ))}
            </ul>
            <button onClick={addEmployee}>Add Employee</button>
        </div>
    );
}

export default EditSTModal;
