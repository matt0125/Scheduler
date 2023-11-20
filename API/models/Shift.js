const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for the 'Shift' collection
const shiftSchema = new Schema({
  _id: Schema.Types.ObjectId,
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