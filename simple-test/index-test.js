const expect = require('chai').expect,
      sinon = require('sinon');

const ChatService = require('../index.js');

describe('simple tests', () => {

        describe('sinon spy', () => {

            it('should create a function able to record arguments passed to it', () => {

                const anonymousSpy = sinon.spy();

                ChatService.register('spy', anonymousSpy);
                ChatService.register('me', () => {});
                ChatService.publish('me', 'hello there');
                ChatService.publish('me', 'how are you?');

                expect(anonymousSpy.called).to.be.true;
                expect(anonymousSpy.getCall(0).args[0]).to.be.equal('hello there');
                expect(anonymousSpy.getCall(1).args[0]).to.be.equal('how are you?');
            });

        });

});

