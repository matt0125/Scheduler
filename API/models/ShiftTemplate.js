const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shiftTemplateSchema = new mongoose.Schema({
  dayOfWeek: Number,
  startTime: String,
  endTime: String,
<<<<<<< HEAD
  positionId:  Schema.Types.ObjectId,
=======
  positionId: Schema.Types.ObjectId,
>>>>>>> 7ed8e9b42c1818af2e91f87b5ed041d67a2f5758
});

module.exports = mongoose.model('ShiftTemplate', shiftTemplateSchema, 'ShiftTemplate');