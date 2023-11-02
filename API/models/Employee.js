const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  empId: {
    type: String,
  },
  positionId: {
    type: String,
  },
  title: {
    type: String,
  },
  dayAvail: {
    type: String,
  },
  endAvail: {
    type: String,
  },
  startAvail: {
    type: String,
  },
  managerIdent: {
    type: Boolean,
  }
});

employeeSchema.index({ username: 1 }, { unique: true });

module.exports = mongoose.model('Employee', employeeSchema, 'Employee');