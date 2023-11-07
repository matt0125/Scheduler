const Employee = require('../models/Employee');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; // for bcrypt password hashing

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

    // If the password matches, proceed to login
    return res.json({ message: 'Login successful', id: user._id });
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

// Availabilities are stored as an array of objects in the Employee model

exports.createAvailability = async (req, res) => {
  try {
    const { employeeId } = req.params; // Get the employee ID from the request parameters
    const { dayOfWeek, startTime, endTime } = req.body; // Get the availability details from the request body

    // Check for required availability details
    if (dayOfWeek === undefined || startTime === undefined || endTime === undefined) {
      return res.status(400).json({ message: 'All fields are required for creating availability' });
    }

    // Find the employee by ID and add the new availability to the array
    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      {
        $push: {
          availability: { dayOfWeek, startTime, endTime } // Push the new availability object into the availability array
        }
      },
      { new: true, runValidators: true } // Return the updated document and run validators defined in the schema
    );

    // Check if the update was successful
    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

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
