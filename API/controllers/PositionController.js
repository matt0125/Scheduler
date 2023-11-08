const Position = require('../models/Position'); // Assuming your Position model is in the same directory

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
      res.status(200).json(positions);
    } catch (error) {
      res.status(400).json({ message: 'Failed to get positions', error });
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
    } catch (error) {
      res.status(400).json({ message: 'Failed to get position by name', error });
    }
  }
};

module.exports = PositionController;
