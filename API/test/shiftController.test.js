const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const shiftController = require('../controllers/shiftController');
const Shift = require('../models/Shift');
const Employee = require('../models/Employee');
const ShiftTemplate = require('../models/ShiftTemplate');

// Mocking the models and request/response
let mockShift, mockEmployee, mockShiftTemplate, mockReq, mockRes;

describe('Shift Controller Tests', () => {
  
  beforeEach(() => {
    mockShift = sinon.stub(Shift.prototype, 'save');
    mockEmployee = sinon.stub(Employee, 'findById');
    mockShiftTemplate = sinon.stub(ShiftTemplate, 'findById');
    mockReq = { body: {} };
    mockRes = { json: sinon.spy(), status: sinon.stub().returnsThis() };
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should create a shift successfully', async () => {
    console.log("Employee type is: ", typeof Employee);
    mockReq.body = { date: '12-25-23', empId: '123', templateId: '456' };
    mockEmployee.resolves({ _id: '123', positions: [{ _id: '456' }], availability: [{ dayOfWeek: 1, startTime: '08:00', endTime: '17:00' }] });
    mockShiftTemplate.resolves({ _id: '456', dayOfWeek: 1, startTime: '08:00', endTime: '17:00', positionId: '456' });
    mockShift.resolves();

    await shiftController.createShift(mockReq, mockRes);

    expect(mockRes.status.calledWith(201)).to.be.true;
    expect(mockRes.json.calledOnce).to.be.true;
  });

  it('should return a 404 if employee not found', async () => {
    mockReq.body = { date: '12-25-23', empId: '999', templateId: '456' };
    mockEmployee.resolves(null);
    
    await shiftController.createShift(mockReq, mockRes);

    expect(mockRes.status.calledWith(404)).to.be.true;
  });

  it('should return a 404 if shift template not found', async () => {
    mockReq.body = { date: '12-25-23', empId: '123', templateId: '999' };
    mockEmployee.resolves({ _id: '123', positions: [{ _id: '456' }], availability: [{ dayOfWeek: 1, startTime: '08:00', endTime: '17:00' }] });
    mockShiftTemplate.resolves(null);

    await shiftController.createShift(mockReq, mockRes);

    expect(mockRes.status.calledWith(404)).to.be.true;
  });

  it('should return a 400 if employee does not hold the required position', async () => {
    mockReq.body = { date: '12-25-23', empId: '123', templateId: '456' };
    mockEmployee.resolves({ _id: '123', positions: [{ _id: '789' }], availability: [] });
    mockShiftTemplate.resolves({ _id: '456', positionId: '456' });

    await shiftController.createShift(mockReq, mockRes);

    expect(mockRes.status.calledWith(400)).to.be.true;
  });

  it('should return a 400 if employee is not available at the required time', async () => {
    mockReq.body = { date: '12-25-23', empId: '123', templateId: '456' };
    mockEmployee.resolves({ _id: '123', positions: [{ _id: '456' }], availability: [{ dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }] });
    mockShiftTemplate.resolves({ _id: '456', dayOfWeek: 1, startTime: '08:00', endTime: '17:00', positionId: '456' });

    await shiftController.createShift(mockReq, mockRes);

    expect(mockRes.status.calledWith(400)).to.be.true;
  });

  // More tests could be added for additional scenarios
});

