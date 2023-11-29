const mongoose = require('mongoose');
const ShiftTemplate = require('../models/ShiftTemplate');
const Position = require('../models/Position');
const Employee = require('../models/Employee');

exports.createShiftTemplate = async (req, res) => {
  try {
    console.log("Creating shift template...");

    const { dayOfWeek, startTime, endTime, color, positionId, managerId } = req.body;

    // Create a new shift template
    const newShiftTemplate = new ShiftTemplate({
      _id: new mongoose.Types.ObjectId(),
      dayOfWeek,
      startTime,
      endTime,
      color,
      positionId,
      managerId,
    });

    console.log("The new shift template is ", newShiftTemplate);

    // Save to the database
    try {
      await newShiftTemplate.save();
    } catch (e) {
      console.log("ERRROR")
      console.log(e.message);
      throw new Error("Failed to create shift template");
    }
    
    
    console.log('New shift template created: ', newShiftTemplate);

    res.status(201).json(newShiftTemplate);
  } 
  
  catch (error) {
    res.status(400).json({ message: 'Failed to create shift template', error });
    console.log('There was an error creating shift template', error);
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
    const { dayOfWeek, startTime, endTime, positionId, managerId, color } = req.body;

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
    console.log('Fetching shift templates for a specific manager...');

    // Assuming the manager's ID is passed as a query parameter
    const managerId = req.params.managerId;

    if (!managerId) {
      return res.status(400).json({ message: 'Manager ID is required' });
    }

    const shiftTemplates = await ShiftTemplate.find({ managerId }).populate({path:'positionId', model: Position});

    if (!shiftTemplates || shiftTemplates.length === 0) {
      console.log('No shift templates found for this manager');
      return res.status(200).json({ message: 'No shift templates found for this manager', shiftTemplates: [] });
    }

    res.status(200).json({shiftTemplates: shiftTemplates});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shift templates for the manager', error });
    console.error('There was an error fetching shift templates for the manager', error);
    console.log(error);
  }
};

exports.deleteShiftTemplatesByPosition = async (req, res) => {
  try {
    console.log("Deleting shift templates for position...");

    const { positionId } = req.params; // Assuming positionId is passed as a URL parameter

    // Validate if the position exists
    const positionExists = await Position.findById(positionId);
    if (!positionExists) {
      return res.status(404).json({ message: 'Position not found' });
    }

    // Delete all shift templates for the given position
    await ShiftTemplate.deleteMany({ positionId });

    res.status(200).json({ message: `Shift templates for position ${positionId} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete shift templates', error });
    console.error('There was an error deleting shift templates by position', error);
  }
};

exports.nuke = async (req, res) => {
  try {
    await ShiftTemplate.deleteMany({});

  } catch (error) {
    console.log('Error nuking shiftTemplates:', error);
    res.status(500).json({ message: 'Error nuking shiftTemplates', error: error.toString() });
  }
};