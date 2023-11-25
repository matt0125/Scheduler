const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for the 'Schedule' collection
const scheduleSchema = new Schema({
  _id: Schema.Types.ObjectId,
  startDate: Date,
  endDate: Date,
  managerId: {
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  },
  shifts: [{ type: Schema.Types.ObjectId, ref: 'Shift' }],
});

// Create a model for the 'Schedule' collection and export it
module.exports = mongoose.model('Schedule', scheduleSchema, 'Schedule');