const mongoose = require('mongoose');
const Shift = require('../models/Shift');
const Employee = require('../models/Employee');
const ShiftTemplate = require('../models/ShiftTemplate');
const { createShift } = require('../controllers/ShiftController');

jest.mock('../models/Shift');
jest.mock('../models/Employee');
jest.mock('../models/ShiftTemplate');

describe('createShift', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Add tests here
    // Example:
    it('should return 400 for missing required fields', async () => {
        const req = {
            body: {} // Missing date, empId, templateId
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        await createShift(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Missing required fields' });
    });

    it('should return 400 for invalid date format', async () => {
        const req = {
            body: {
                date: '31/12/2023', // Invalid format
                empId: 'emp123',
                templateId: 'template123'
            }
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };
    
        await createShift(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid date format' });
    });

    it('should create a shift successfully', async () => {
        // Create a mock for populate
        const mockEmployeeAvailability = new Array(7).fill().map(() => new Array(24).fill(true));
        mockEmployeeAvailability[1].fill(true, 9, 18);

        const mockPopulate = jest.fn().mockResolvedValue({
            _id: 'emp123',
            positions: [{ _id: 'position1' }],
            availability: mockEmployeeAvailability
        });
    
        // Mock findById to return an object with the populate method
        Employee.findById = jest.fn(() => ({ populate: mockPopulate }));
    
        ShiftTemplate.findById.mockResolvedValue({
            positionId: 'position1',
            startTime: '09:00',
            endTime: '17:00'
        });
    
        Shift.prototype.save = jest.fn().mockImplementation(function () {
            return this;
        });
    
        const req = {
            body: {
                date: '02-22-2023', // Monday
                empId: 'emp123',
                templateId: 'template123'
            }
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };
    
        await createShift(req, res);
    
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.any(Object));
    
        // Verify that findById and populate were called correctly
        expect(Employee.findById).toHaveBeenCalledWith('emp123');
        expect(mockPopulate).toHaveBeenCalledWith('positions');
    });
    
    
    
});
