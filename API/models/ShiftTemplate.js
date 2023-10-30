const mongoose = require('mongoose');

const shiftTemplateSchema = new mongoose.Schema({
  dayOfWeek: String,
  startTime: String,
  endTime: String,
  positionId: String,
});

module.exports = mongoose.model('ShiftTemplate', shiftTemplateSchema, 'ShiftTemplate');