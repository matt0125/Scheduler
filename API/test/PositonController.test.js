const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const PositionController = require('../controllers/PositionController');
const Position = require('../models/Position');
const Employee = require('../models/Employee');

const { expect } = chai;

// createPosition
describe('createPosition', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {
                name: 'Test Position',
            },
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy(),
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should create a position successfully', async () => {
        // Mock the Position model's save method
        const saveStub = sinon.stub(Position.prototype, 'save');

        // Assume the save operation is successful
        saveStub.resolves({ _id: new mongoose.Types.ObjectId(), name: 'Test Position' });

        // Call the createPosition method with the mocked request and response
        await PositionController.createPosition(req, res);

        // Assertions
        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledOnce).to.be.true;

        const createdPosition = res.json.firstCall.args[0];
        expect(createdPosition).to.have.property('_id');
        expect(createdPosition).to.have.property('name', 'Test Position');
    });

    it('should handle errors during position creation', async () => {
        // Mock the Position model's save method to simulate an error
        const saveStub = sinon.stub(Position.prototype, 'save');
        saveStub.rejects(new mongoose.Error('Simulated error during save'));

        // Call the createPosition method with the mocked request and response
        await PositionController.createPosition(req, res);

        // Assertions
        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledOnce).to.be.true;

        const errorResponse = res.json.firstCall.args[0];
        expect(errorResponse).to.have.property('message', 'Failed to create position');
        expect(errorResponse).to.have.property('error');
    });
});

// getPosition
describe('getPosition', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            params: {
                id: '123', // Replace with a valid position ID
            },
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy(),
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should get a position by ID successfully', async () => {
        // Mock Position.findById to simulate finding a position
        const positionData = { _id: '123', name: 'Test Position', managerId: '456' };
        const findByIdStub = sinon.stub(Position, 'findById');
        findByIdStub.withArgs(req.params.id).resolves(positionData);

        // Call the getPosition method with the mocked request and response
        await PositionController.getPosition(req, res);

        // Assertions
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledOnce).to.be.true;

        const returnedPosition = res.json.firstCall.args[0];
        expect(returnedPosition).to.deep.equal(positionData);
    });

    it('should handle errors during getPosition', async () => {
        // Mock Position.findById to simulate an error
        const findByIdStub = sinon.stub(Position, 'findById');
        findByIdStub.rejects(new Error('Simulated error during find'));

        // Call the getPosition method with the mocked request and response
        await PositionController.getPosition(req, res);

        // Assertions
        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledOnce).to.be.true;

        const errorResponse = res.json.firstCall.args[0];
        expect(errorResponse).to.have.property('message', 'Failed to get position');
        expect(errorResponse).to.have.property('error');
    });

    it('should handle position not found during getPosition', async () => {
        // Mock Position.findById to simulate not finding a position
        const findByIdStub = sinon.stub(Position, 'findById');
        findByIdStub.withArgs(req.params.id).resolves(null);

        // Call the getPosition method with the mocked request and response
        await PositionController.getPosition(req, res);

        // Assertions
        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledOnce).to.be.true;

        const notFoundResponse = res.json.firstCall.args[0];
        expect(notFoundResponse).to.have.property('message', 'Position not found');
    });
});

// getAllPositions
describe('getAllPositions', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {};
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy(),
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should get all positions successfully', async () => {
        // Mock Position.find to simulate finding positions
        const positionsData = [
            { _id: '123', name: 'Position 1', managerId: '456' },
            { _id: '456', name: 'Position 2', managerId: '789' },
        ];
        const findStub = sinon.stub(Position, 'find');
        findStub.resolves(positionsData);

        // Call the getAllPositions method with the mocked request and response
        await PositionController.getAllPositions(req, res);

        // Assertions
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledOnce).to.be.true;

        const returnedPositions = res.json.firstCall.args[0].positions;
        expect(returnedPositions).to.deep.equal(positionsData);
    });

    it('should handle errors during getAllPositions', async () => {
        // Mock Position.find to simulate an error
        const findStub = sinon.stub(Position, 'find');
        findStub.rejects(new Error('Simulated error during find'));

        // Call the getAllPositions method with the mocked request and response
        await PositionController.getAllPositions(req, res);

        // Assertions
        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledOnce).to.be.true;

        const errorResponse = res.json.firstCall.args[0];
        expect(errorResponse).to.have.property('message', 'Failed to get positions');
        expect(errorResponse).to.have.property('error');
    });
});

// updatePosition
describe('updatePosition', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            params: { id: '123' },
            body: { name: 'Updated Position' },
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy(),
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should update a position successfully', async () => {
        // Mock Position.findByIdAndUpdate to simulate updating a position
        const updatedPosition = { _id: '123', name: 'Updated Position', managerId: '456' };
        const findByIdAndUpdateStub = sinon.stub(Position, 'findByIdAndUpdate');
        findByIdAndUpdateStub.resolves(updatedPosition);

        // Call the updatePosition method with the mocked request and response
        await PositionController.updatePosition(req, res);

        // Assertions
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(res.json.firstCall.args[0]).to.deep.equal(updatedPosition);
    });

    it('should handle errors during updatePosition', async () => {
        // Mock Position.findByIdAndUpdate to simulate an error
        const findByIdAndUpdateStub = sinon.stub(Position, 'findByIdAndUpdate');
        findByIdAndUpdateStub.rejects(new Error('Simulated error during update'));

        // Call the updatePosition method with the mocked request and response
        await PositionController.updatePosition(req, res);

        // Assertions
        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledOnce).to.be.true;

        const errorResponse = res.json.firstCall.args[0];
        expect(errorResponse).to.have.property('message', 'Failed to update position');
        expect(errorResponse).to.have.property('error');
    });

    it('should handle position not found during updatePosition', async () => {
        // Mock Position.findByIdAndUpdate to simulate updating a non-existent position
        const findByIdAndUpdateStub = sinon.stub(Position, 'findByIdAndUpdate');
        findByIdAndUpdateStub.resolves(null);

        // Call the updatePosition method with the mocked request and response
        await PositionController.updatePosition(req, res);

        // Assertions
        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledOnce).to.be.true;

        const notFoundResponse = res.json.firstCall.args[0];
        expect(notFoundResponse).to.have.property('message', 'Position not found');
    });
});

// deletePosition
describe('deletePosition', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            params: { id: '123' },
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy(),
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should delete a position successfully', async () => {
        // Mock Position.findByIdAndDelete to simulate deleting a position
        const deletedPosition = { _id: '123', name: 'Deleted Position', managerId: '456' };
        const findByIdAndDeleteStub = sinon.stub(Position, 'findByIdAndDelete');
        findByIdAndDeleteStub.resolves(deletedPosition);

        // Call the deletePosition method with the mocked request and response
        await PositionController.deletePosition(req, res);

        // Assertions
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(res.json.firstCall.args[0]).to.deep.equal({ message: 'Position deleted successfully' });
    });

    it('should handle errors during deletePosition', async () => {
        // Mock Position.findByIdAndDelete to simulate an error
        const findByIdAndDeleteStub = sinon.stub(Position, 'findByIdAndDelete');
        findByIdAndDeleteStub.rejects(new Error('Simulated error during delete'));

        // Call the deletePosition method with the mocked request and response
        await PositionController.deletePosition(req, res);

        // Assertions
        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledOnce).to.be.true;

        const errorResponse = res.json.firstCall.args[0];
        expect(errorResponse).to.have.property('message', 'Failed to delete position');
        expect(errorResponse).to.have.property('error');
    });

    it('should handle position not found during deletePosition', async () => {
        // Mock Position.findByIdAndDelete to simulate deleting a non-existent position
        const findByIdAndDeleteStub = sinon.stub(Position, 'findByIdAndDelete');
        findByIdAndDeleteStub.resolves(null);

        // Call the deletePosition method with the mocked request and response
        await PositionController.deletePosition(req, res);

        // Assertions
        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledOnce).to.be.true;

        const notFoundResponse = res.json.firstCall.args[0];
        expect(notFoundResponse).to.have.property('message', 'Position not found');
    });
});

// getPositionByName
describe('getPositionByName', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            params: { name: 'TestPosition' },
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy(),
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should get a position by name successfully', async () => {
        // Mock Position.findOne to simulate finding a position
        const foundPosition = { _id: '123', name: 'TestPosition', managerId: '456' };
        const findOneStub = sinon.stub(Position, 'findOne');
        findOneStub.resolves(foundPosition);

        // Call the getPositionByName method with the mocked request and response
        await PositionController.getPositionByName(req, res);

        // Assertions
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(res.json.firstCall.args[0]).to.deep.equal(foundPosition);
    });

    it('should handle errors during getPositionByName', async () => {
        // Mock Position.findOne to simulate an error
        const findOneStub = sinon.stub(Position, 'findOne');
        findOneStub.rejects(new Error('Simulated error during getPositionByName'));

        // Call the getPositionByName method with the mocked request and response
        await PositionController.getPositionByName(req, res);

        // Assertions
        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledOnce).to.be.true;

        const errorResponse = res.json.firstCall.args[0];
        expect(errorResponse).to.have.property('message', 'Failed to get position by name');
        expect(errorResponse).to.have.property('error');
    });

    it('should handle position not found during getPositionByName', async () => {
        // Mock Position.findOne to simulate not finding a position
        const findOneStub = sinon.stub(Position, 'findOne');
        findOneStub.resolves(null);

        // Call the getPositionByName method with the mocked request and response
        await PositionController.getPositionByName(req, res);

        // Assertions
        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledOnce).to.be.true;

        const notFoundResponse = res.json.firstCall.args[0];
        expect(notFoundResponse).to.have.property('message', 'Position not found');
    });
});

// createPositionByManager

// describe('createPositionByManager', () => {
//     let req;
//     let res;

//     beforeEach(() => {

//     });

//     afterEach(() => {
//         sinon.restore();
//     });

//     it('should create a new position by manager successfully', async () => {

//     });

//     it('should handle errors during createPositionByManager', async () => {

//     });

//     it('should handle manager not found during createPositionByManager', async () => {
 
//     });
// });

// getPositionsByManager

