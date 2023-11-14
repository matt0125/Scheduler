const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for the 'Shift' collection
const shiftTemplateSchema = new Schema({
  _id: Schema.Types.ObjectId,
  dayOfWeek: Number,
  startTime: String,
  endTime: String,
  positionId: {
    type: Schema.Types.ObjectId,
    ref: 'Position'
  },
  managerId: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
  }
});

module.exports = mongoose.model('ShiftTemplate', shiftTemplateSchema, 'ShiftTemplate');