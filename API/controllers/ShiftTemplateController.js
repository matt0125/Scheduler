const ShiftTemplate = require('../models/ShiftTemplate');

exports.createShiftTemplate = async (req, res) => {
  try {
    console.log("creating shift template...");

    const { _id, dayOfWeek, startTime, endTime, positionId, templateId } = req.body;
    
    // Create a new shift template
    const newShiftTemplate = new ShiftTemplate({
      _id,
      dayOfWeek,
      startTime,
      endTime,
      positionId,
    });
    
    // Save to the database
    await newShiftTemplate.save();
    
    console.log('new shift template created: ', newShiftTemplate);

    res.status(201).json(newShiftTemplate);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create shift template', error });
  }
};

exports.getShiftTemplate = async (req, res) => {
  try {
    console.log("fetching shift template...");

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
    console.log('editing shift template...');
    console.log('request body:', req.body);

    const { id } = req.params;
    const { dayOfWeek, startTime, endTime, positionId } = req.body;

    console.log('shift template id:', id);

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
    console.log("deleting shift template...");

    const { id } = req.params;

    console.log('shift template deleted: ', id);
    
    await ShiftTemplate.findByIdAndDelete(id);

    res.status(200).json({ message: 'Shift template deleted successfully' });
  } 
  
  catch (error) {
    res.status(400).json({ message: 'Failed to delete shift template', error });
  }
};