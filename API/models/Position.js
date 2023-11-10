const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const positionSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true, // if 'name' is always required, otherwise remove this line
  }
});

// Create a model for the 'Position' collection and export it
module.exports = mongoose.model('Position', positionSchema, 'Position');