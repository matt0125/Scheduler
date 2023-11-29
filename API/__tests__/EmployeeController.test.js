const { registerEmployee } = require('../controllers/EmployeeController');
const { loginEmployee } = require('../controllers/EmployeeController');
const Employee = require('../models/Employee');
const bcrypt = require('bcrypt');
const emailService = require('../controllers/EmailService');
const jwt = require('jsonwebtoken');

jest.mock('../models/Employee');
jest.mock('bcrypt');
jest.mock('../controllers/EmailService');
jest.mock('jsonwebtoken');

describe('registerEmployee', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 201 and employee ID on successful registration', async () => {
        // Mocking findOne to simulate no existing user
        Employee.findOne.mockResolvedValue(null);
        // Mocking bcrypt hash
        bcrypt.hash.mockResolvedValue('hashedPassword');
        // Mocking emailService
        emailService.sendVerificationEmail.mockResolvedValue();

        // Mock Employee constructor to return an object with a mock save method
        const mockEmployeeInstance = { save: jest.fn().mockResolvedValue({
            _id: 'mockEmployeeId',
            // other properties as needed
        })};
        Employee.mockImplementation(() => mockEmployeeInstance);

        // Mock secret key
        const mockSecretKey = 'testSecretKey';

        // Mock JWT sign to return a dummy token
        jwt.sign.mockReturnValue('dummyToken');

        const req = {
            body: {
                username: 'testUser',
                password: 'P@ssw0rd!',
                email: 'test@example.com',
                // other required fields
            }
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        await registerEmployee(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Employee registered successfully',
            employeeId: expect.any(String),
            token: expect.any(String)
        }));
    });

    // Add more tests for error cases (e.g., missing fields, password validations, username already exists, etc.)
    it('should return 400 if required fields are missing', async () => {
        const req = {
            body: {
                // Omitting required fields like username, password, or email
                email: 'test@example.com'
            }
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };
    
        await registerEmployee(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'All fields are required' });
    });
  

    it('should return 400 if username length is invalid', async () => {
        const req = {
            body: {
                username: 'u', // Invalid length
                password: 'P@ssw0rd!',
                email: 'test@example.com'
            }
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };
    
        await registerEmployee(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Username must be between 2 to 20 characters' });
    });

    // You can create similar tests for each password complexity requirement
    it('should return 400 if password does not contain an uppercase letter', async () => {
      const req = {
          body: {
              username: 'testUser',
              password: 'password1!', // No uppercase letter
              email: 'test@example.com'
          }
      };
      const res = {
          status: jest.fn(() => res),
          json: jest.fn()
      };

      await registerEmployee(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Password must contain at least one uppercase letter' });
    });

    it('should return 400 if username already exists', async () => {
        Employee.findOne.mockResolvedValue({ username: 'existingUser' });
    
        const req = {
            body: {
                username: 'existingUser',
                password: 'P@ssw0rd!',
                email: 'test@example.com'
            }
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };
    
        await registerEmployee(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Username already exists' });
    });
});

describe('loginEmployee', () => {
  beforeEach(() => {
      jest.clearAllMocks();
  });

  it('should return success and token on successful login', async () => {
      // Mock user data
      const mockUser = {
          _id: 'mockUserId',
          password: 'hashedPassword',
          isValidated: true
      };
      Employee.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('dummyToken');

      const req = {
          body: {
              username: 'validUser',
              password: 'validPassword'
          }
      };
      const res = {
          json: jest.fn(),
          status: jest.fn(() => res)
      };

      await loginEmployee(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          message: 'Login successful',
          id: expect.any(String),
          token: expect.any(String)
      }));
  });

  it('should return 400 if username or password is missing', async () => {
      const testCases = [
          { username: 'validUser' }, // Missing password
          { password: 'validPassword' } // Missing username
      ];

      for (const body of testCases) {
          const req = { body };
          const res = {
              status: jest.fn(() => res),
              json: jest.fn()
          };

          await loginEmployee(req, res);

          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({ message: 'Please enter both a username and password' });
      }
  });

  it('should return 401 for invalid username', async () => {
      Employee.findOne.mockResolvedValue(null);

      const req = {
          body: {
              username: 'invalidUser',
              password: 'validPassword'
          }
      };
      const res = {
          status: jest.fn(() => res),
          json: jest.fn()
      };

      await loginEmployee(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid username or password' });
  });

  it('should return 401 for incorrect password', async () => {
      const mockUser = {
          _id: 'mockUserId',
          password: 'hashedPassword',
          isValidated: true
      };
      Employee.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      const req = {
          body: {
              username: 'validUser',
              password: 'invalidPassword'
          }
      };
      const res = {
          status: jest.fn(() => res),
          json: jest.fn()
      };

      await loginEmployee(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid username or password' });
  });

  it('should return 401 if employee account is not validated', async () => {
      const mockUser = {
          _id: 'mockUserId',
          password: 'hashedPassword',
          isValidated: false
      };
      Employee.findOne.mockResolvedValue(mockUser);

      const req = {
          body: {
              username: 'validUser',
              password: 'validPassword'
          }
      };
      const res = {
          status: jest.fn(() => res),
          json: jest.fn()
      };

      await loginEmployee(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Employee account is not validated' });
  });

  it('should return 500 for unexpected errors', async () => {
      const errorMessage = 'Error authenticating user';
      Employee.findOne.mockRejectedValue(new Error(errorMessage));

      const req = {
          body: {
              username: 'validUser',
              password: 'validPassword'
          }
      };
      const res = {
          status: jest.fn(() => res),
          json: jest.fn()
      };

      await loginEmployee(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage, error: expect.any(Error) });
  });

});
