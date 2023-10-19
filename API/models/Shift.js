const mongoose = require('mongoose');

// Define the schema for the 'Shift' collection
const shiftSchema = new mongoose.Schema({
  date: String,
  empId: String,
  templateId: String,
});

// Create a model for the 'Shift' collection and export it
module.exports = mongoose.model('Shift', shiftSchema, 'Shift');