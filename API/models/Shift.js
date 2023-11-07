const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the 'Shift' collection
const shiftSchema = new mongoose.Schema({
  date: Date,
  empId: {
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  },
  templateId:  {
    type: Schema.Types.ObjectId,
    ref: 'ShiftTemplate'
  },
});

// Create a model for the 'Shift' collection and export it
module.exports = mongoose.model('Shift', shiftSchema, 'Shift');