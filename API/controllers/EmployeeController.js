const Employee = require('../models/Employee');
const Position = require('../models/Position');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; // for bcrypt password hashing
const jwt = require('jsonwebtoken');
const e = require('express');
const secretKey = process.env.JWT_SECRET_KEY;

// Was used for unique index testing

// Employee.syncIndexes().then(() => {
//   console.log('Indexes have been synchronized');
// }).catch(err => {
//   console.log('Error synchronizing indexes:', err);
// });

// Employee.collection.getIndexes({ full: true }).then(indexes => {
//   console.log("indexes:", indexes);
// }).catch(console.error);

// Employee.collection.dropIndex('_id_', function(err, result) {
//   if (err) {
//     console.log('Error in dropping index!', err);
//   } else {
//     console.log('Index dropped:', result);
//   }
//});

exports.registerEmployee = async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      firstName,
      lastName,
      phone,
      managerIdent,
      managedBy,
      availability,
      positions, // Assuming this is an array of position IDs
      preference
    } = req.body;

    // Validations
    if (!username || !password || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (username.length < 2 || username.length > 20) {
      return res.status(400).json({ message: 'Username must be between 2 to 20 characters' });
    }

    // Password complexity validations
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one uppercase letter' });
    }

    if (!/[a-z]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one lowercase letter' });
    }

    if (!/[0-9]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one number' });
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one special character' });
    }

    // Hash password before storing it
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Assuming that `positions` and `preference` arrays are passed in the request as needed
    const newEmployee = new Employee({
      _id: new mongoose.Types.ObjectId(), // generate a new ObjectId
      username,
      password: hashedPassword, // store the hashed password
      email,
      firstName,
      lastName,
      phone,
      managerIdent,
      managedBy,
      availability, // make sure to validate the structure on the client side or before saving
      isVailadated: false,
      positions, // ensure this is an array of ObjectId references to the Position model
      preference, // as above, validate structure before saving
      __v: 0 // typically this is handled by Mongoose and does not need to be set manually
    });

    const savedEmployee = await newEmployee.save();
    console.log('Saved employee with ID:', savedEmployee._id);
    
    // Not sure why the foundEmployee is queried right after saving, seems redundant
    // const foundEmployee = await Employee.findById(savedEmployee._id);
    // console.log('Directly queried employee:', foundEmployee);

    res.status(201).json({ message: 'Employee registered successfully', employeeId: savedEmployee._id });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    res.status(500).json({ message: 'Error registering employee', err });
    console.error("There was an error:", err);
  }
};

exports.loginEmployee = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Please enter both a username and password' });
    }

    const user = await Employee.findOne({ username: { $regex: new RegExp(username, 'i') } });

    if (!user) {
      // It's generally a good security practice to give the same error message for both invalid username or password
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // If the password matches, create a JWT token
    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '72h' }); // Expires in 2 hours

    // If the password matches, proceed to login
    return res.json({ message: 'Login successful', id: user._id, token: token });
  } catch (error) {
    res.status(500).json({ message: 'Error authenticating user', error });
    console.error("There was an error logging in:", error);
  }
};

exports.getEmployee = async (req, res) => {
  try {
    console.log("Fetching employeee...");

    const { id } = req.params;

    const employee = await Employee.findById(id);

    console.log('id: ', id);
    console.log('employee: ', employee); 

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found'});
    }

    res.status(200).json(employee);
  }

  catch (error) {
    res.status(500).json({ message: 'Error fetching employee', error: error });
    console.error('There was an error fetching an employee', error );
  }
}

exports.getEmployeeByAvailability = async (req, res) => {
  try {
    console.log('Fetching employees by availability...');
    
    const { dayOfWeek, startTime, endTime } = req.body;

    // Find employees with matching availability
    const employees = await Employee.find({
      availability: {
        $elemMatch: {
          dayOfWeek: dayOfWeek,
          startTime: startTime,
          endTime: endTime,
        },
      },
    });

    if (!employees || employees.length === 0) {
      return res.status(404).json({ message: 'No employees found with the specified availability' });
    }

    res.status(200).json(employees);
  } 
  
  catch (error) {
    res.status(500).json({ message: 'Error fetching employees by availability', error });
    console.error('There was an error fetching employees by availability', error);
  }
};

// Given a manager, get all of their employees
exports.getEmployeesByManager = async (req, res) => {
  try {
    const { id: managerId } = req.params; // Get the employee ID from the request parameters

    // Find the employee by ID
    const manager = await Employee.findById(managerId).select('-_id firstName lastName email phone positions').populate('positions');
    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }

    const employees = await Employee.find({managedBy: manager.managedBy, _id: { $ne: managerId}}).select('-_id firstName lastName email phone positions').populate('positions');

    res.status(200).json({manager: manager, employees: employees});
  }
  

  catch (error) {
    res.status(500).json({ message: 'Error searching for employees', error: error.toString() });
    console.error("There was an error:", error);
  }
}

// Given an employee, get their teammates (other employees) that are managed by the same person
exports.getManager = async (req, res) => {
  try {
    const { employeeId } = req.params; // Get the employee ID from the request parameters

    // Find the employee by ID
    const manager = await Employee.findById(employeeId).select('-_id managedBy').populate({path:'managedBy', select:'-password -__v'});

    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }

    res.status(200).json({manager: manager.managedBy});
  }
  

  catch (error) {
    res.status(500).json({ message: 'Error searching for employees', error: error.toString() });
    console.error("There was an error:", error);
  }
}

// Given an employee, get their teammates (other employees) that are managed by the same person
exports.getTeammates = async (req, res) => {
  try {
    const { employeeId } = req.params; // Get the employee ID from the request parameters

    // Find the employee by ID
    const employee = await Employee.findById(employeeId).select('-_id firstName lastName email phone managedBy positions')
    .populate({path:'positions', select:'-_id name'});

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const teammates = await Employee.find({managedBy: { $exists: true, $ne: null, $eq: employee.managedBy }, _id: { $ne: employeeId}})
    .select('-_id firstName lastName email phone positions')
    .populate({path:'positions', select:'-_id name'});

    const manager = await Employee.findById(employee.managedBy).select('-_id firstName lastName email phone positions')
    .populate({path:'positions', select:'-_id name'});

    res.status(200).json({employee: employee, manager: manager, teammates: teammates});
  }
  

  catch (error) {
    res.status(500).json({ message: 'Error searching for employees', error: error.toString() });
    console.error("There was an error:", error);
  }
}

// Availabilities are stored as an array of objects in the Employee model

exports.setAvailability = async (req, res) => {
  try {
    const { employeeId } = req.params; // Get the employee ID from the request parameters
    const { availability } = req.body; // Get the availability details from the request body

    // Check for required availability details
    if (availability === undefined) {
      return res.status(400).json({ message: '\'availability\' is required for creating availability' });
    }

    // Find the employee by ID and add the new availability to the array
    const employee = await Employee.findById( employeeId );

    // Check if the update was successful
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    employee.availability = availability;

    employee.save();

    // Send the updated availability array back to the client
    res.status(200).json({
      message: 'Availability added successfully',
      availability: updatedEmployee.availability
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating availability', err });
    console.error("There was an error:", err);
  }
}

exports.addAvailability = async (req, res) => {
  try {
    const { employeeId } = req.params; // Get the employee ID from the request parameters
    const { dayOfWeek, startTime, endTime } = req.body; // Get the availability details from the request body

    // Check for required availability details
    if (dayOfWeek === undefined || startTime === undefined || endTime === undefined) {
      return res.status(400).json({ message: '\'dayOfWeek\', \'startTime\', \'endTime\' are required for creating availability' });
    }

    try {
      if(startTime.split(" ")[1] != null || endTime.split(" ")[1] != null) {
        return res.status(400).json({ message: 'startTime and endTime should be 0:00 - 23:00' });
      }
    }
    catch (err) {

    }

    // Find the employee by ID and add the new availability to the array
    const employee = await Employee.findById( employeeId );

    // Check if the update was successful
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const startIndex = startTime.split(":")[0];
    const endIndex = endTime.split(":")[0];

    for (let i = startIndex; i <= endIndex; i++) {
      employee.availability[dayOfWeek][i] = true;
    }

    employee.save();

    // Send the updated availability array back to the client
    res.status(200).json({
      message: 'Availability added successfully',
      availability: updatedEmployee.availability
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating availability', err });
    console.error("There was an error:", err);
  }
};

// Update an employee's availability
exports.updateAvailability = async (req, res) => {
  try {
    const { employeeId } = req.params; // You'll need to pass the specific availability ID
    const { dayOfWeek, oldStartTime, oldEndTime, newStartTime, newEndTime } = req.body;

    // Check for required availability details
    if (dayOfWeek === undefined || oldStartTime === undefined || oldEndTime === undefined || newStartTime === undefined || newEndTime === undefined) {
      return res.status(400).json({ message: '\'dayOfWeek\', \'oldStartTime\', \'oldEndTime\', \'newStartTime\', \'newEndTime\' are required for creating availability' });
    }

    try {
      if(oldStartTime.split(" ")[1] != null || oldEndTime.split(" ")[1] != null || newStartTime.split(" ")[1] != null || newEndTime.split(" ")[1] != null) {
        return res.status(400).json({ message: '\'oldStartTime\', \'oldEndTime\', \'newStartTime\' and \'newEndTime\' should be 0:00 - 23:00' });
      }
    }
    catch (err) {

    }

    // Find the employee by ID and add the new availability to the array
    const employee = await Employee.findById( employeeId );

    // Check if the update was successful
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const startIndex = oldStartTime.split(":")[0];
    const endIndex = oldEndTime.split(":")[0];

    for (let i = startIndex; i <= endIndex; i++) {
      employee.availability[dayOfWeek][i] = false;
    }

    startIndex = newStartTime.split(":")[0];
    endIndex = newEndTime.split(":")[0];

    for (let i = startIndex; i <= endIndex; i++) {
      employee.availability[dayOfWeek][i] = true;
    }

    employee.save();

    // Send the updated availability array back to the client
    res.status(200).json({
      message: 'Availability updated successfully',
      availability: updatedEmployee.availability
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating availability', err });
    console.error("There was an error:", err);
  }
};

// Delete an employee's availability
exports.deleteAvailability = async (req, res) => {
  try {
    const { employeeId } = req.params; // Get the employee ID from the request parameters
    const { dayOfWeek, startTime, endTime } = req.body; // Get the availability details from the request body

    // Check for required availability details
    if (dayOfWeek === undefined || startTime === undefined || endTime === undefined) {
      return res.status(400).json({ message: '\'dayOfWeek\', \'startTime\', \'endTime\' are required for creating availability' });
    }

    try {
      if(startTime.split(" ")[1] != null || endTime.split(" ")[1] != null) {
        return res.status(400).json({ message: 'startTime and endTime should be 0:00 - 23:00' });
      }
    }
    catch (err) {

    }

    // Find the employee by ID and add the new availability to the array
    const employee = await Employee.findById( employeeId );

    // Check if the update was successful
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const startIndex = startTime.split(":")[0];
    const endIndex = endTime.split(":")[0];

    for (let i = startIndex; i <= endIndex; i++) {
      employee.availability[dayOfWeek][i] = false;
    }

    employee.save();

    // Send the updated availability array back to the client
    res.status(200).json({
      message: 'Availability removed successfully',
      availability: updatedEmployee.availability
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating availability', err });
    console.error("There was an error:", err);
  }
};

// Get an employee's availabilities
exports.getAvailabilities = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await Employee.findById(employeeId, 'availability');

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found'});
    }

    res.status(200).json({availability: employee.availability});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching availabilities', error: error.toString() });
    console.error('There was an error fetching availabilities', error );
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { employeeId } = req.params; // Assuming the employee ID is passed in the URL
    console.log(employeeId);
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }

    // Find the employee by ID
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Compare current password with the hashed password in the database
    const isMatch = await bcrypt.compare(currentPassword, employee.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the password in the database
    employee.password = hashedNewPassword;
    await employee.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating password', err });
    console.error("There was an error:", err);
  }
};

exports.updateEmployeeProfile = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { firstName, lastName, email, phone } = req.body;

    let updateFields = {};
    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (email) updateFields.email = email;
    if (phone) updateFields.phone = phone;

    // Check if at least one field is provided for update
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'At least one field is required to update' });
    }

    // Find the employee by ID and update the provided fields
    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      { $set: updateFields },
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({
      message: 'Employee updated successfully',
      employee: updatedEmployee
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating employee', err });
    console.error("There was an error:", err);
  }
};

exports.updateEmployeeProfile = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { firstName, lastName, email, phone } = req.body;

    let updateFields = {};
    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (email) updateFields.email = email;
    if (phone) updateFields.phone = phone;

    // Check if at least one field is provided for update
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'At least one field is required to update' });
    }

    // Find the employee by ID and update the provided fields
    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      { $set: updateFields },
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({
      message: 'Employee updated successfully',
      employee: updatedEmployee
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating employee', err });
    console.error("There was an error:", err);
  }
};

exports.updateEmployeeProfile = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { firstName, lastName, email, phone } = req.body;

    let updateFields = {};
    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (email) updateFields.email = email;
    if (phone) updateFields.phone = phone;

    // Check if at least one field is provided for update
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'At least one field is required to update' });
    }

    // Find the employee by ID and update the provided fields
    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      { $set: updateFields },
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({
      message: 'Employee updated successfully',
      employee: updatedEmployee
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating employee', err });
    console.error("There was an error:", err);
  }
};

exports.getAllManagers = async (req, res) => {
  try {
    // Find the employee by ID
    const managers = await Employee.find({managerIdent: { $exists: true, $ne: null, $eq: true }}).populate('positions');
    if (!managers) {
      return res.status(404).json({ message: 'No managers found' });
    }

    res.status(200).json({ managers: managers });
  } catch (error) {
    res.status(500).json({ message: 'Error updating password', error: error.toString() });
    console.error("There was an error:", error);
  }
};

exports.assignManager = async (req, res) => {
  try {
    const { employeeId } = req.params; // Assuming the employee ID is passed in the URL
    
    const { managerId } = req.body;

    // Find the employee by ID
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Find the employee by ID
    const manager = await Employee.findById(managerId);
    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }
    if (manager.managerIdent == false) {
      return res.status(401).json({ message: 'Employee is not a manager' });
    }

    // Update the password in the database
    employee.managedBy = managerId;
    await employee.save();

    res.status(200).json({ message: 'Manager assigned successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning manager', error: error.toString() });
    console.error("There was an error:", error);
  }
};

exports.getEmployeesByPosition = async (req, res) => {
  try {
    // Extract the position ID from the request parameters or body
    const { positionId } = req.params; // or req.body, depending on how you want to pass the position ID

    // Validate the positionId if necessary

    // Find employees who have the specified positionId in their 'positions' array
    const employees = await Employee.find({
      positions: { $in: [positionId] } // Assuming 'positions' is an array of ObjectId references
    });

    if (employees.length === 0) {
      // No employees found with the specified position
      return res.status(404).json({ message: 'No employees found for the given position' });
    }

    // Return the list of employees
    res.status(200).json({ employees });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ message: 'Error fetching employees by position', error: error.toString() });
    console.error('There was an error fetching employees by position:', error);
  }
};

exports.addPositionToEmployee = async (req, res) => {
  try {
    const { employeeId, positionId } = req.params; // or from req.body

    // Find the employee
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if the position already exists in the employee's positions
    if (employee.positions.includes(positionId)) {
      return res.status(400).json({ message: 'Position already assigned to this employee' });
    }

    // Find the position
    const position = await Position.findById(positionId);
    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }

    // Add position to the employee's positions array
    employee.positions.push(positionId);
    await employee.save();

    res.status(200).json({ message: 'Position added to employee successfully', employee });
  } catch (error) {
    res.status(400).json({ message: 'Failed to add position to employee', error: error.toString() });
    console.log('There was an error adding position to employee:', error);
  }
};

// given an employee, remove its manager
exports.removeManagerFromEmployee = async (req, res) => {
  try {
    const empId = req.params.empId; // Assuming the employee ID is passed in the request parameters

    const employee = await Employee.findById(empId);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (employee.managedBy === null) {
      return res.status(400).json({ message: 'Employee does not have a manager' });
    }

    employee.managedBy = null;
    
    await employee.save();

    res.status(200).json({ message: 'Manager removed successfully', employee: employee });
  } 
  
  catch (error) {
    res.status(500).json({ message: 'An error occurred while removing the manager from the employee', error: error.toString() });
    console.error('There was an error while trying to remove a manager from an employee', error);
  }
};

exports.getManagerByName = async (req, res) => {
  try {
    const managerName = req.params.managerName; // Assuming the manager name is provided in the request parameters

    // Find the manager(s) with the specified name
    const managers = await Employee.find({
      $and: [
        { managerIdent: true }, // Assuming managers have managerIdent set to true
        {
          $or: [
            { firstName: new RegExp(managerName, 'i') },
            { lastName: new RegExp(managerName, 'i') },
            { username: new RegExp(managerName, 'i') },
          ],
        },
      ],
    });

    // Check if any managers were found
    if (managers.length === 0) {
      return res.status(404).json({ message: 'Manager not found' });
    }

    res.status(200).json({ managers: managers });
  } 
  
  catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching manager by name', error: error.toString() });
    console.error('There was an error while fetching manager by name', error);
  }
};

exports.removePositionFromEmployee = async (req, res) => {
  try {
    const { empId, positionId } = req.params;

    const employee = await Employee.findById(empId);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Remove the specified position from the employee's positions array
    employee.positions.pull(positionId);

    // Save the updated employee
    const updatedEmployee = await employee.save();

    res.status(200).json(updatedEmployee);
  }

  catch (error) {
    res.status(500).json({ message: 'An error occurred while removing a position from an employee', error: error.toString() });
    console.error('There was an error while removing a position from an employee', error);
  }
}
