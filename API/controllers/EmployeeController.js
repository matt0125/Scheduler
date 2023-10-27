const Employee = require('../models/Employee');

Employee.syncIndexes().then(() => {
  console.log('Indexes have been synchronized');
}).catch(err => {
  console.log('Error synchronizing indexes:', err);
});

Employee.collection.getIndexes({ full: true }).then(indexes => {
  console.log("indexes:", indexes);
}).catch(console.error);

Employee.collection.dropIndex('_id_', function(err, result) {
  if (err) {
    console.log('Error in dropping index!', err);
  } else {
    console.log('Index dropped:', result);
  }
});

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
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Username already exists' });
    }
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

  catch (error) {
    res.status(500).json({ message: 'Error authenticating user', error});
    console.error("There was an error logging in", error);
  }
};

exports.getEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id);

    // employee object not found - username or empid not in database
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found'});
    }

    res.status(200).json(employee);
  }

  catch (error) {
    res.status(500).json({ message: 'Error fetching employee', error: error });
    console.error('There was an error when fetching an employee', error );
  }
}