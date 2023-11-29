const mongoose = require('mongoose');
const { createShiftTemplate } = require('../controllers/ShiftTemplateController');
const { getShiftTemplate } = require('../controllers/ShiftTemplateController');
const ShiftTemplate = require('../models/ShiftTemplate');

jest.mock('../models/ShiftTemplate');

describe('createShiftTemplate', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a shift template successfully', async () => {
        const mockShiftTemplateData = {
            dayOfWeek: 'Monday',
            startTime: '09:00',
            endTime: '17:00',
            color: 'blue',
            positionId: 'position123',
            managerId: 'manager123'
        };

        // Mock save function
        ShiftTemplate.prototype.save = jest.fn().mockResolvedValue(mockShiftTemplateData);

        const req = {
            body: mockShiftTemplateData
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        await createShiftTemplate(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should return 400 for errors during shift template creation', async () => {
        const mockError = new Error('Failed to create shift template');
        ShiftTemplate.prototype.save = jest.fn().mockRejectedValue(mockError);
    
        const req = {
            body: {
                // ... shift template data (none needed for this test)
            }
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };
    
        await createShiftTemplate(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Failed to create shift template', error: mockError });
    });
});

describe('getShiftTemplate', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should retrieve a shift template successfully', async () => {
        const mockShiftTemplate = {
            _id: 'mockId',
            // other properties of the shift template
        };
        ShiftTemplate.findById = jest.fn().mockResolvedValue(mockShiftTemplate);

        const req = {
            params: { id: 'mockId' }
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        await getShiftTemplate(req, res);

        expect(ShiftTemplate.findById).toHaveBeenCalledWith('mockId');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockShiftTemplate);
    });

    it('should return 404 if shift template not found', async () => {
        ShiftTemplate.findById = jest.fn().mockResolvedValue(null);

        const req = {
            params: { id: 'mockId' }
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        await getShiftTemplate(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Shift template not found' });
    });

    it('should handle errors during fetching shift template', async () => {
        const mockError = new Error('Database error');
        ShiftTemplate.findById = jest.fn().mockRejectedValue(mockError);

        const req = {
            params: { id: 'mockId' }
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        await getShiftTemplate(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching shift template', error: mockError });
    });
});

