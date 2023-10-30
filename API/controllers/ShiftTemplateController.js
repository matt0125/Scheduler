const ShiftTemplate = require('../models/ShiftTemplate');

exports.createShiftTemplate = async (req, res) => {
  try {
    const { _id, dayOfWeek, startTime, endTime, positionId, templateId } = req.body;
    
    // Create a new shift template
    const newShiftTemplate = new ShiftTemplate({
      _id,
      dayOfWeek,
      startTime,
      endTime,
      positionId,
      templateId
    });
    
    // Save to the database
    await newShiftTemplate.save();
    
    res.status(201).json(newShiftTemplate);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create shift template', error });
  }
};

exports.getShiftTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const shiftTemplate = await ShiftTemplate.findById(id);

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
    const { dayOfWeek, startTime, endTime, positionId, templateId } = req.body;

    console.log('Shift template id:', id);

    const updatedShiftTemplate = await ShiftTemplate.findByIdAndUpdate(
      id,
      { dayOfWeek, startTime, endTime, positionId, templateId },
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
    const { id } = req.params;

    await ShiftTemplate.findByIdAndDelete(id);

    res.status(200).json({ message: 'Shift template deleted successfully' });
  } 
  
  catch (error) {
    res.status(400).json({ message: 'Failed to delete shift template', error });
  }
};