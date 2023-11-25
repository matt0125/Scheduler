
const employeeController = require('../controllers/EmployeeController'); // Adjust the path as necessary
const Employee = require('../models/Employee'); // Adjust the path as necessary
const Position = require('../models/Position');
console.log('Position import:', Position);
console.log('EmployeeController import:', employeeController);
const bcrypt = require('bcrypt');
// const mongoose = require('mongoose');
jest.mock('../models/Employee'); // Mock the Employee model
jest.mock('bcrypt');
// jest.mock('mongoose');
 

describe('registerEmployee', () => {
    beforeEach(() => {
      // Reset mocks before each test
      Employee.mockClear();
      bcrypt.hash.mockClear();
    });

    afterEach(() => {
        console.log('Employee Mock Instance:', Employee.mock);
    });
  
    it('should create a new employee successfully', async () => {
      const req = {
        body: {
          username: 'newuser',
          password: 'Password1!',
          email: 'newuser@example.com',
          firstName: 'John',
          lastName: 'Doe',
          phone: '1234567890',
        }
      };
  
      const jsonMock = jest.fn();
      const statusMock = jest.fn(() => ({ json: jsonMock }));
      const res = { status: statusMock };
  
      await employeeController.registerEmployee(req, res);
  
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Employee registered successfully'
      }));
    });
  
    it('should return an error if required fields are missing', async () => {
      const req = {
        body: {
          username: '',
          password: '',
          email: ''
        }
      };
  
      const jsonMock = jest.fn();
      const statusMock = jest.fn(() => ({ json: jsonMock }));
      const res = { status: statusMock };
  
      await employeeController.registerEmployee(req, res);
  
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
        message: 'All fields are required'
      }));
    });
  
    // ... additional tests for other scenarios ...
  });