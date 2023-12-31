require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const employeeController = require('./controllers/EmployeeController'); // Importing the employee controller
const shiftTemplateController = require('./controllers/ShiftTemplateController');
const shiftController = require('./controllers/ShiftController');
const positionController = require('./controllers/PositionController');
const { create } = require('domain');
const jwt = require('jsonwebtoken');
const scheduleController = require('./controllers/ScheduleController');
const secretKey = process.env.JWT_SECRET_KEY;

// Middleware to authenticate and protect routes
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.options('*', cors());

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

// employee
app.post('/api/register', employeeController.registerEmployee);
app.post('/api/login', employeeController.loginEmployee);
app.put('/api/employee/:employeeId/position/:positionId', employeeController.addPositionToEmployee);

app.get('/api/employee/:empId/ismanager', employeeController.isManager);

// Email verification
app.get('/api/verify-email/:token', employeeController.verifyEmail);

// Password reset endpoints
app.post('/api/request-password-reset', employeeController.requestPasswordReset);
app.post('/api/reset-password', employeeController.resetPassword);

// Protected routes below this line
app.use(authenticateJWT);

app.get('/api/employee/:id', employeeController.getEmployee);
app.get('/api/employee/:employeeId/teammates', employeeController.getTeammates);
app.post('/api/employee/availability', employeeController.getEmployeeByAvailability);
app.get('/api/manager/:id/employees', employeeController.getEmployeesByManager);

app.get('/api/employee/:employeeId/manager', employeeController.getManager);
app.get('/api/manager/:managerName', employeeController.getManagerByName);
app.delete('/api/employee/:empId/removeManager', employeeController.removeManagerFromEmployee);
app.delete('/api/employee/:empId/position/:positionId', employeeController.removePositionFromEmployee);
 
// post register
app.get('/api/managers', employeeController.getAllManagers);
app.post('/api/employee/:employeeId/assign/manager', employeeController.assignManager);

// availabilities
app.post('/api/employee/:employeeId/availability', employeeController.addAvailability);
app.get('/api/employee/:employeeId/availabilities', employeeController.getAvailabilities);

app.put('/api/employee/:employeeId/availabilityByString', employeeController.updateAvailability);
app.put('/api/employee/:employeeId/availabilityByArray', employeeController.setAvailability);
app.delete('/api/employee/:employeeId/availabilityByString', employeeController.deleteAvailability);

// shifts
app.post('/api/shifts', shiftController.createShift);
app.get('/api/shifts/:id', shiftController.getShift);
app.put('/api/shifts/:id', shiftController.editShift);
app.delete('/api/shifts/:id', shiftController.deleteShift);

app.post('/api/shifts/empbydates', shiftController.getShiftByEmployeeAndDate);
app.post('/api/shifts/managerbydates', shiftController.getShiftByManagerAndDate);

app.get('/api/shifts/date/:date', shiftController.getShiftByDate);
app.get('/api/shifts/employee/:empId', shiftController.getShiftByEmployee);
app.post('/api/shifts/manager', shiftController.getShiftByManager);

app.delete('/api/shifts/employee/:empId', shiftController.deleteShiftsByEmployee);
app.post('/api/manager/shifts/delete', shiftController.deleteShiftsByRangeAndManager);

app.post('/api/employee/:empId/timeoff', employeeController.dayOff);

// shift templates
app.post('/api/shift-templates', shiftTemplateController.createShiftTemplate);
app.get('/api/shift-templates/:id', shiftTemplateController.getShiftTemplate);
app.put('/api/shift-templates/:id', shiftTemplateController.editShiftTemplate);
app.delete('/api/shift-templates/:id', shiftTemplateController.deleteShiftTemplate);

app.get('/api/shift-templates/manager/:managerId', shiftTemplateController.getShiftTemplateByManager);
app.delete('/api/shift-templates/position/:positionId', shiftTemplateController.deleteShiftTemplatesByPosition);

// Positions
app.post('/api/position', positionController.createPosition);
app.post('/api/positions', positionController.createMultiplePositions);

// app.get('/api/position/:name', positionController.getPositionByName);
app.get('/api/position/:id', positionController.getPosition);
app.get('/api/position', positionController.getAllPositions);

app.put('/api/position/:id', positionController.updatePosition);
app.delete('/api/position/:id', positionController.deletePosition);

app.get('/api/positions/:managerId', positionController.getPositionsByManager);
app.post('/api/positions/manager', positionController.createPositionByManager);

// Update employee
app.put('/api/employee/:employeeId/password', employeeController.updatePassword);
app.put('/api/update/employee/:employeeId', employeeController.updateEmployeeProfile);
app.get('/api/employee/position/:positionId', employeeController.getEmployeesByPosition);

app.post('/api/schedule/generate', scheduleController.generateSchedule);

app.post('/api/nuke/pleasedontdothis/itcannotbereversed/pleasereadbeforesending', (req, res) => {
  employeeController.nuke(req, res);
  positionController.nuke(req, res);
  scheduleController.nuke(req, res);
  shiftController.nuke(req, res);
  shiftTemplateController.nuke(req, res);

  res.status(200).json({ message: 'Database nuked successfully' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
