const mongoose = require('mongoose');

// Define the schema for the 'Position' collection
const positionSchema = new mongoose.Schema({
  _id: Schema.Type.ObjectId,
  name: {
    type: String,
    required: true // if 'name' is always required, otherwise remove this line
  }
});

// Create a model for the 'Position' collection and export it
module.exports = mongoose.model('Position', positionSchema, 'Position');