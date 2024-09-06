const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const chatsService = require('../services/chats-service');
const chatsController = require('../controllers/chats-controller');


describe('Chats Controller', () => {
    describe('getAllByDesigner', () => {
        let req, res, next;

        beforeEach(() => {
            req = {
                user: {
                    id: '12345'
                }
            };
            res = {
                status: stub().returnsThis(),
                json: stub()
            };
            next = stub();
        });

        it('should return all chats successfully for a designer', async () => {
            const mockedChats = [{ chatId: 'abc', message: 'Hello' }];
            stub(chatsService, 'getAllByDesigner').resolves(mockedChats);

            await _getAllByDesigner(req, res);

            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWith({
                message: 'Getting all chats success',
                body: mockedChats,
                done: true,
                status: 'success'
            })).to.be.true;

            getAllByDesigner.restore();
        });

        it('should handle errors and return a 200 status with error message', async () => {

            const errorMessage = new Error('Internal server error');
            stub(chatsService, 'getAllByDesigner').rejects(errorMessage);


            await _getAllByDesigner(req, res);


            expect(res.status.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWith({
                message: 'Internal server error',
                e: errorMessage,
                status: 'error'
            })).to.be.true;

            getAllByDesigner.restore();
        });
    });
});
