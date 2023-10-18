const mongoose = require('mongoose');

const shiftTemplateSchema = new mongoose.Schema({
  _id: String,
  dayOfWeek: String,
  startTime: String,
  endTime: String,
  positionId: String,
  templateId: String
});

const ShiftTemplate = mongoose.model('ShiftTemplate', shiftTemplateSchema, 'ShiftTemplate');

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

exports.deleteShiftTemplate = async (req, res) => {
    try {
      const { id } = req.params;
      await ShiftTemplate.findByIdAndDelete(id);
      res.status(200).json({ message: 'Shift template deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Failed to delete shift template', error });
    }
};