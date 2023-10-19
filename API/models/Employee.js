const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
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
    required: true
  },
  empId: {
    type: String,
    required: true
  },
  positionId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  dayAvail: {
    type: String,
    required: true
  },
  endAvail: {
    type: String,
    required: true
  },
  startAvail: {
    type: String,
    required: true
  },
  managerIdent: {
    type: Boolean,
    default: false
  }
});

employeeSchema.index({ username: 1 }, { unique: true });

module.exports = mongoose.model('Employee', employeeSchema, 'Employee');