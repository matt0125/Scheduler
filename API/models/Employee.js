const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Availability subdocument schema
const AvailabilitySchema = new Schema({
  dayOfWeek: Number,
  startTime: String,
  endTime: String,
  isValidated: Boolean
});

// Preference subdocument schema
const PreferenceSchema = new Schema({
  dayOfWeek: Number,
  startTime: String,
  endTime: String
});

// Main Employee schema
const EmployeeSchema = new Schema({
  _id: Schema.Types.ObjectId,
  firstName: String,
  lastName: String,
  username: String,
  password: String, // This should be hashed, not stored in plain text
  email: String,
  phone: String,
  managerIdent: Boolean,
  managedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  },
  availability: [AvailabilitySchema],
  isValidated: Boolean,
  positions: [{ type: Schema.Types.ObjectId, ref: 'Position' }], // Assuming 'Position' is another model
  preference: [PreferenceSchema]
});

// If 'Position' is a separate model, define its schema as well
// const PositionSchema = new Schema({
//   // define the schema for the Position if necessary
// });

// mongoose.model('Position', PositionSchema);
const Employee = mongoose.model('Employee', EmployeeSchema, 'Employee');

module.exports = Employee;
