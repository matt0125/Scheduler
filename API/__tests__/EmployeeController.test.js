const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const employeeController = require('../controllers/EmployeeController');
const Employee = require('../models/Employee');
const nodemailer = require('nodemailer');

// Mocking dependencies
jest.mock('bcrypt');
jest.mock('../models/Employee');
jest.mock('nodemailer');
jest.mock('mongoose', () => {
    const originalModule = jest.requireActual('mongoose');
    return {
      ...originalModule,
      Types: {
        ...originalModule.Types,
        ObjectId: jest.fn().mockReturnValue({}), // Mock only ObjectId method
      },
    };
});

// Mock data
let mockRequest, mockResponse, nextFunction;

beforeEach(() => {
  mockRequest = {
    body: {
        username: 'testuser',
        password: 'Test@1234',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        phone: '1234567890',
    }
  };
  mockResponse = {
    status: jest.fn(() => mockResponse),
    json: jest.fn(),
  };
  nextFunction = jest.fn();

  // Mock bcrypt hash function
  bcrypt.hash.mockResolvedValue('hashedPassword');

  // Mock Mongoose ObjectId and save function
  mongoose.Types.ObjectId.mockReturnValue({}); // Mock ObjectId
  Employee.prototype.save = jest.fn().mockResolvedValue({ _id: 'mockId' }); // Mock save
});

// Reset mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

it('Successful employee registration', async () => {
    await employeeController.registerEmployee(mockRequest, mockResponse, nextFunction);
  
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Employee registered successfully',
      employeeId: expect.anything(),
    });
});
