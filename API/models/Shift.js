const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the 'Shift' collection
const shiftSchema = new mongoose.Schema({
  date: Date,
  empId: Schema.Types.ObjectId,
  templateId: Schema.Types.ObjectId,
});

// Create a model for the 'Shift' collection and export it
module.exports = mongoose.model('Shift', shiftSchema, 'Shift');