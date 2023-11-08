const ShiftTemplate = require('../models/ShiftTemplate');
const Position = require('../models/Position');
const Employee = require('../models/Employee');

exports.createShiftTemplate = async (req, res) => {
  try {
    console.log("Creating shift template...");

    const { dayOfWeek, startTime, endTime, positionId } = req.body;

    // Create a new shift template
    const newShiftTemplate = new ShiftTemplate({
      dayOfWeek,
      startTime,
      endTime,
      positionId,
    });
    
    console.log(dayOfWeek);
    console.log(positionId);

    // Save to the database
    await newShiftTemplate.save();
    
    console.log('New shift template created: ', newShiftTemplate);

    res.status(201).json(newShiftTemplate);
  } 
  
  catch (error) {
    res.status(400).json({ message: 'Failed to create shift template', error: error.toString() });
  }
};

exports.getShiftTemplate = async (req, res) => {
  try {
    console.log("Fetching shift template...");

    const { id } = req.params;

    const shiftTemplate = await ShiftTemplate.findById(id);

    console.log('id: ', id);
    console.log('shiftTemplate: ', shiftTemplate);

    if (!shiftTemplate) {
      return res.status(404).json({ message: 'Shift template not found'});
    }

    res.status(200).json(shiftTemplate);
  }

  catch (error) {
    res.status(500).json({ message: 'Error fetching shift template', error: error });
    console.error('There was an error fetching shift template', error );
  }
}

exports.editShiftTemplate = async (req, res) => {
  try {
    console.log('Editing shift template...');
    console.log('Request body:', req.body);

    const { id } = req.params;
    const { dayOfWeek, startTime, endTime, positionId } = req.body;

    console.log('Shift template id:', id);

    const updatedShiftTemplate = await ShiftTemplate.findByIdAndUpdate(
      id,
      { dayOfWeek, startTime, endTime, positionId },
      { new: true }
    );

    if (!updatedShiftTemplate) {
      return res.status(404).json({ message: 'Shift template not found'});
    }

    res.status(200).json(updatedShiftTemplate);
  }

  catch(error) {
    res.status(500).json({ message: 'Failed to edit shift', error });
    console.error('There was an error editing shift template', error );
  }
}

exports.deleteShiftTemplate = async (req, res) => {
  try {
    console.log("Deleting shift template...");

    const { id } = req.params;

    console.log('Shift template deleted: ', id);
    
    await ShiftTemplate.findByIdAndDelete(id);

    res.status(200).json({ message: 'Shift template deleted successfully' });
  } 
  
  catch (error) {
    res.status(400).json({ message: 'Failed to delete shift template', error });
  }
};

exports.getShiftTemplateByManager = async (req, res) => {
  try {
    console.log('Fetching shift templates by manager...');

    // Step 1: Find all employees with managerIdent set to true
    const managerEmployees = await Employee.find({ managerIdent: true });

    // Step 2: Get the positions associated with manager employees
    const managedPositions = managerEmployees.reduce((positions, employee) => {
      return positions.concat(employee.positions);
    }, []);

    // Step 3: Find shift templates whose positionId matches the managed positions
    const shiftTemplates = await ShiftTemplate.find({
      positionId: { $in: managedPositions },
    });

    if (!shiftTemplates || shiftTemplates.length === 0) {
      return res.status(404).json({ message: 'No shift templates found for managers' });
    }

    res.status(200).json(shiftTemplates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shift templates for managers', error });
    console.error('There was an error fetching shift templates for managers', error);
  }
};


