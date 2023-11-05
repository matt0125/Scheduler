const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shiftTemplateSchema = new mongoose.Schema({
  dayOfWeek: Number,
  startTime: String,
  endTime: String,
  positionId: Schema.Types.ObjectId,
});

module.exports = mongoose.model('ShiftTemplate', shiftTemplateSchema, 'ShiftTemplate');