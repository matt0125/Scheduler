require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const employeeController = require('./EmployeeController'); // Importing the employee controller
const shiftTemplateController = require('./ShiftTemplateController');
const { create } = require('domain');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB Atlas
console.log('Connecting to MongoDB...');
console.log('Mongo URI:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB Connected');
}).catch(err => {
  console.log('Error connecting to MongoDB:', err);
});

// Middleware
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// API Endpoints
app.post('/api/register', employeeController.registerEmployee);
app.post('/api/login', employeeController.loginEmployee);
app.post('/api/shift-templates', shiftTemplateController.createShiftTemplate);
app.delete('/api/shift-templates/:id', shiftTemplateController.deleteShiftTemplate);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
