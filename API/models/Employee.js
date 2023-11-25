const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// // Availability subdocument schema
// const AvailabilitySchema = new Schema({
//   0: [bool],
//   dayOfWeek: Number,
//   startTime: String,
//   endTime: String,
//   isValidated: Boolean
// });

// Preference subdocument schema
const PreferenceSchema = new Schema({
  availability : {
    type: [[Boolean]], // Define a 2D array of Booleans
    validate: {
      validator: function(arr) {
        // Validate the dimensions here if needed
        return arr.length === 7 && arr.every(innerArr => innerArr.length === 24);
      },
      message: props =>
        `${props.value} must be a 2D array with dimensions 7x24!`, // Custom error message
    },
    default: () => new Array(7).fill().map(() => new Array(24).fill(false)), // Default value
  },
});

const AvailabilityPreferenceSchema = new Schema({
  dayOfWeek: Number,
  startTime: String,
  endTime: String
});

// Main Employee schema
const EmployeeSchema = new Schema({
  _id: Schema.Types.ObjectId,
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  username: { type: String, default: '' },
  password: { type: String, default: '' }, // This should be hashed, not stored in plain text
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  managerIdent: { type: Boolean, default: false },
  verificationToken: { type: String, default: '' },
  managedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  },
  availability: {
    type: [[Boolean]], // Define a 2D array of Booleans
    validate: {
      validator: function(arr) {
        // Validate the dimensions here if needed
        return arr.length === 7 && arr.every(innerArr => innerArr.length === 24);
      },
      message: props =>
        `${props.value} must be a 2D array with dimensions 7x24!`, // Custom error message
    },
    default: () => new Array(7).fill().map(() => new Array(24).fill(true)), // Default value
  },
  isValidated: { type: Boolean, default: false },
  positions: [{ type: Schema.Types.ObjectId, ref: 'Position' }],
  preference: [PreferenceSchema]
});

// If 'Position' is a separate model, define its schema as well
// const PositionSchema = new Schema({
//   // define the schema for the Position if necessary
// });

// mongoose.model('Position', PositionSchema);
const Employee = mongoose.model('Employee', EmployeeSchema, 'Employee');

module.exports = Employee;
