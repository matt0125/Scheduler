const Position = require('../models/Position'); // Assuming your Position model is in the same directory
const Employee = require('../models/Employee'); // Assuming your Employee model is in the same directory
const mongoose = require('mongoose');

const PositionController = {
  // Create a new Position
  createPosition: async (req, res) => {
    try {
      const { name } = req.body;
      const newPosition = new Position({ name });
      await newPosition.save();
      res.status(201).json(newPosition);
    } catch (error) {
      res.status(400).json({ message: 'Failed to create position', error });
    }
  },

  // Read (get) a single Position by ID
  getPosition: async (req, res) => {
    try {
      const { id } = req.params;
      console.log("position Id is ", id);
      const position = await Position.findById(id);
      if (!position) {
        return res.status(404).json({ message: 'Position not found' });
      }
      res.status(200).json(position);
    } catch (error) {
      res.status(400).json({ message: 'Failed to get position', error });
    }
  },

  // Read (get) all Positions
  getAllPositions: async (req, res) => {
    try {
      const positions = await Position.find({});
      res.status(200).json( { positions: positions } );
    } catch (error) {
      res.status(400).json({ message: 'Failed to get positions', error: error });
    }
  },

  // Update a Position
  updatePosition: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const position = await Position.findByIdAndUpdate(id, { name }, { new: true });
      if (!position) {
        return res.status(404).json({ message: 'Position not found' });
      }
      res.status(200).json(position);
    } catch (error) {
      res.status(400).json({ message: 'Failed to update position', error });
    }
  },

  // Delete a Position
  deletePosition: async (req, res) => {
    try {
      const { id } = req.params;
      const position = await Position.findByIdAndDelete(id);
      if (!position) {
        return res.status(404).json({ message: 'Position not found' });
      }
      res.status(200).json({ message: 'Position deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Failed to delete position', error });
    }
  },

  // Read (get) a single Position by name
  getPositionByName: async (req, res) => {
    try {
      const { name } = req.params; // Assuming you're passing the name as a URL parameter
      
      const position = await Position.findOne({ name: name });
      
      if (!position) {
        return res.status(404).json({ message: 'Position not found' });
      }
      
      res.status(200).json(position);
    } 
    
    catch (error) {
      res.status(400).json({ message: 'Failed to get position by name', error });
    }
  },

  createPositionByManager: async (req, res) => {
    try {
      console.log("HERE23");
      console.log(req.body);
      const { name, managerId } = req.body; // Assuming the manager's ID is sent in the request body


      const newPosition = new Position({ _id: new mongoose.Types.ObjectId(), name, managerId });
      await newPosition.save();
  
      const manager = await Employee.findOne({ _id: managerId, managerIdent: true });
      if (!manager) {
        return res.status(404).json({ message: 'Manager does not exist' });
      }
  
      console.log('newPosition:', newPosition);
      res.status(201).json({ newPosition, manager, managerId });
    } catch (error) {
      console.log("ERROR HERE");
      console.log(error);
      res.status(400).json({ message: 'Failed to create position by manager', error });
    }
  },

  getPositionsByManager: async (req, res) => {
    try {
      const { managerId } = req.params; // Assuming you're passing the manager ID as a URL parameter
      // Mongoose's populate method to automatically replace the position IDs 
      // in the positions array with the actual position documents from the database.
      const manager = await Employee.findById(managerId).populate('positions');
      const positions = await Position.find({ managerId: managerId });
      res.json(positions);
    } catch (error) {
      res.status(400).json({ message: 'Failed to get positions by manager', error });
      console.log("Here: ", error.message);
    }
  },
};

module.exports = PositionController;
