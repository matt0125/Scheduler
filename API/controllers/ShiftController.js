const mongoose = require('mongoose');
const Shift = require('../models/Shift');
const Employee = require('../models/Employee');
const ShiftTemplate = require('../models/ShiftTemplate');
const Position  = require('../models/Position');

exports.createShift = async (req, res) => {
  
  try {
    console.log('Creating shift...');
    console.log('Type of Employee in controller:', typeof Employee);
    
    const { date, empId, templateId } = req.body;

    if (!date || !empId || !templateId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate date format and check if it's a valid date
    if (!/^\d{2}-\d{2}-\d{4}$/.test(date)) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    const [month, day, year] = date.split('-').map(d => parseInt(d, 10));

    if (isNaN(month) || month < 1 || month > 12 ||
        isNaN(day) || day < 1 || day > 31 ||
        isNaN(year) || year < 1000 || year > 9999) {
      return res.status(400).json({ message: 'Invalid date' });
    }

    // Construct a date object and validate it
    const shiftDate = new Date(year, month - 1, day);
    if (!(shiftDate instanceof Date && !isNaN(shiftDate))) {
      return res.status(400).json({ message: 'Invalid date' });
    }

    const dayOfWeek = shiftDate.getDay();

    // Find the employee and the template and validate them
    const employee = await Employee.findById(empId).populate('positions');
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    const template = await ShiftTemplate.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: 'Shift template not found' });
    }

    // Check if employee has the position required by the template
    const positionMatch = employee.positions.some(position => position._id.toString() === template.positionId.toString());
    if (!positionMatch) {
      return res.status(400).json({ message: 'Employee does not hold the required position for this shift' });
    }

    // Validate employee's availability
    tStartHour = template.startTime.split(":")[0];
    tEndHour = template.endTime.split(":")[0];

    for(i = tStartHour; i <= tEndHour; i++) {
      if (!employee.availability[dayOfWeek][i]) {
        return res.status(400).json({ message: 'Employee is not available at this time' });
      }
    }
    
    // Create a new shift
    const newShift = new Shift({
      _id: new mongoose.Types.ObjectId(),
      date,
      empId,
      templateId
    });
    
    // Save to the database
    await newShift.save();
    
    res.status(201).json(newShift);
  } 
  
  catch (error) {
    console.log('Error creating shift:', error)
    res.status(400).json({ message: 'Failed to create shift', error: error.toString() });
  }
};

exports.getShift = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find shift by ID
    const shift = await Shift.findById(id);
    
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    res.status(200).json(shift);
  } 
  
  catch (error) {
    res.status(400).json({ message: 'Failed to get shift', error: error.toString() });
  }
};

exports.editShift = async (req, res) => {
  try {
    console.log('Editing shift...');
    console.log('Request body:', req.body);

    const { id } = req.params;
    const { date, empId, templateId } = req.body;

    console.log('Shift ID:', id);

    // Update shift by ID
    const updatedShift = await Shift.findByIdAndUpdate(
      id,
      { date, empId, templateId },
      { new: true }
    );

    if (!updatedShift) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    res.status(200).json(updatedShift);
  } 
  
  catch (error) {
    res.status(400).json({ message: 'Failed to edit shift', error: error.toString() });
  }
};

exports.deleteShift = async (req, res) => {
  try {
    const { id } = req.params;
    
    await Shift.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Shift deleted successfully' });
  } 
  
  catch (error) {
    res.status(400).json({ message: 'Failed to delete shift', error: error.toString() });
  }
};

function convertTimeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

// Given an date, get all shifst that match
exports.getShiftByDate = async (req, res) => {
  try {
    console.log('Fetching for shifts by date...');

    const { date } = req.params;
    
    console.log(date);
    
    const selectedDate = new Date(date);
    const nextDate = new Date(date);

    nextDate.setDate(selectedDate.getDate() + 1);

    const shifts = await Shift.find({
      date: { $gte: selectedDate, $lt: nextDate },
    }).populate({
      path: 'empId',
      model: Employee,
      select: 'firstName lastName',
    }).populate({
      path: 'templateId',
      model: ShiftTemplate,
      select: 'startTime endTime positionId',
    }).populate({
      path: 'templateId',
      populate: {
        path: 'positionId',
        model: Position,
        select: 'name'
      },
    });
    
    if (!shifts || shifts.length === 0) {
      return res.status(404).json({ message: 'No shifts found for the specified date' });
    }

    res.status(200).json({shifts: shifts});
  }

  catch (error) {
    res.status(500).json({ message: 'Error fetching for shifts by date', error: error.toString() });
    console.error('There was an error fetching for shifts by date', error); 
  }
}

// Given an employee, get all of their shifts
exports.getShiftByEmployee = async (req, res) => {
  try {
    console.log('Fetching for shifts by employee ID...');
    
    const { empId } = req.params;

    const shifts = await Shift.find({ empId });

    if (!shifts || shifts.length === 0) {
      return res.status(404).json({ message: 'No shifts found for the specified employee ID' });
    }

    res.status(200).json(shifts);
  } 
  
  catch (error) {
    res.status(500).json({ message: 'Error fetching shifts by employee ID', error: error.toString() });
    console.error('There was an error fetching shifts by employee ID', error);
  }
};

exports.getShiftByEmployeeAndDate = async (req, res) => {
  try {
    console.log('Fetching for shifts by employee ID and date...');
    
    const { startDate, endDate, empId } = req.body;

    for(i = 0; i < 2; i++)
    {
      if (i == 0)
        date = startDate;
      else
        date = endDate;
      // Validate date format and check if it's a valid date
      if (!/^\d{2}-\d{2}-\d{4}$/.test(date)) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
  
      const [month, day, year] = date.split('-').map(d => parseInt(d, 10));
  
      if (isNaN(month) || month < 1 || month > 12 ||
          isNaN(day) || day < 1 || day > 31 ||
          isNaN(year) || year < 1000 || year > 9999) {
        return res.status(400).json({ message: 'Invalid date' });
      }
  
      // Construct a date object and validate it
      const shiftDate = new Date(year, month - 1, day);
      if (!(shiftDate instanceof Date && !isNaN(shiftDate))) {
        return res.status(400).json({ message: 'Invalid date' });
      }
    }

    const shifts = await Shift.find({
      empId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate({
      path: 'templateId',
      populate: {
        path: 'positionId',
        model: Position,
      },
    });

    if (!shifts || shifts.length === 0) {
      return res.status(404).json({ message: 'No shifts found for the specified employee ID' });
    }

    res.status(200).json({shifts: shifts});
  } 
  
  catch (error) {
    res.status(500).json({ message: 'Error fetching shifts by employee ID', error: error.toString() });
    console.error('There was an error fetching shifts by employee ID', error);
  }
};

exports.getShiftByManager = async (req, res) => {
  try {
    console.log('Fetching shifts by manager...');

    const { empId } = req.body; // assuming the employee is a manager... for now

    // Find employees managed by the specified manager
    const managedEmployees = await Employee.find({ managedBy: empId });

    // Extract the IDs of the managed employees
    const managedEmployeeIds = managedEmployees.map((employee) => employee._id);

    // Find shifts for the managed employees
    const shifts = await Shift.find({
      empId: { $in: managedEmployeeIds },
    });

    if (!shifts || shifts.length === 0) {
      return res.status(404).json({ message: 'No shifts found for employees managed by the specified manager' });
    }

    res.status(200).json({ shifts: shifts });
  } 
  
  catch (error) {
    res.status(500).json({ message: 'Error fetching shifts for employees managed by the specified manager', error: error.toString() });
    console.error('There was an error fetching shifts for employees managed by the specified manager', error);
  }
};

<<<<<<< HEAD
exports.deleteShiftsByEmployee = async (req, res) => {
  try {
    const { empId } = req.params;

    // Optionally, validate if the employee exists
    const employee = await Employee.findById(empId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Delete all shifts associated with the employee
    await Shift.deleteMany({ empId });

    res.status(200).json({ message: `All shifts for employee ${empId} deleted successfully` });
  } catch (error) {
    console.error('Error deleting shifts by employee:', error);
    res.status(500).json({ message: 'Failed to delete shifts by employee', error: error.toString() });
=======
// given a certain employee, delete all of their shifts
exports.deleteShiftByEmployee = async (req, res) => {
  try {

  }
  
  catch (error) {
    res.status(500).json({ message: 'Error when deleting all shifts of an employee', error: error.toString() });
    console.error('There was an error deleting shifts of an employee', error);
>>>>>>> main
  }
};
