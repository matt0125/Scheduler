const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true
  },
  empId: {
    type: String,
    required: true
  },
  positionId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  dayAvail: {
    type: String,
    required: true
  },
  endAvail: {
    type: String,
    required: true
  },
  startAvail: {
    type: String,
    required: true
  },
  managerIdent: {
    type: Boolean,
    default: false
  }
});

const Employee = mongoose.model('Employee', employeeSchema, 'Employee');

exports.registerEmployee = async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      firstName,
      lastName,
      phone,
      empId,
      positionId,
      title,
      dayAvail,
      endAvail,
      startAvail,
      managerIdent
    } = req.body;

    // Validations
    if (!username || !password || !email || !firstName || !lastName || !phone || !empId || !positionId || !title || !dayAvail || !endAvail || !startAvail) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (username.length < 2 || username.length > 20) {
      return res.status(400).json({ message: 'Username must be between 2 to 20 characters' });
    }

    // TODO: Hash password before storing it
    const newEmployee = new Employee({
      username,
      password, 
      email,
      firstName,
      lastName,
      phone,
      empId,
      positionId,
      title,
      dayAvail,
      endAvail,
      startAvail,
      managerIdent
    });

    const savedEmployee = await newEmployee.save();
    console.log('Saved employee with ID:', savedEmployee._id);
    const foundEmployee = await Employee.findById("652deb6f8f4b62b8b05b8743");
    console.log('Directly queried employee:', foundEmployee);

    res.status(201).json({ message: 'Employee registered successfully', newEmployee });
  } catch (err) {
    res.status(500).json({ message: 'Error registering employee', err });
    console.error("There was an error:", err);
  }
};

exports.loginEmployee = async (req, res) => {
  try {
    const {
      username,
      password
    } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Please enter both a username and password' });
    }

    const user = await Employee.findOne({ username: { $regex: new RegExp(username, 'i') } });

    // console.log(user)
    // console.log(username)

    // change error messages to be more vague later
    // need to hash password (bcrypt?)
    if (!user) {
      return res.status(401).json({ message: 'Invalid username' });
    }

    if (user.password !== password)
    {
      return res.status(401).json({ message: 'Invalid password' });
    }

    return res.json({ message: 'Login successful' });
  }

  catch (err) {
    res.status(500).json({ message: 'Error authenticating user', err});
    console.error("There was an error logging in", err);
  }
};
