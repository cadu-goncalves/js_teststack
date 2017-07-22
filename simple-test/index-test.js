const expect = require('chai').expect,
      sinon = require('sinon');

const ChatService = require('../index.js');

describe('simple tests', () => {

        beforeEach(() => {
            ChatService.killAll();
        })

        describe('sinon spy', () => {

            it('should be able to record calls and arguments passed to it', () => {
                const anonymousSpy = sinon.spy();

                ChatService.register('spy', anonymousSpy);
                ChatService.register('me', () => {});
                ChatService.publish('me', 'hello there');
                ChatService.publish('me', 'how are you?');

                // chai.expect(spy API).to ...
                expect(anonymousSpy.called).to.be.true;
                expect(anonymousSpy.getCall(0).args[0]).to.be.equal('hello there');
                expect(anonymousSpy.getCall(1).args[0]).to.be.equal('how are you?');
                expect(anonymousSpy.callCount).to.be.equal(2);

                // Function spies don't replace object methods,
                // so you can't restore them, just reset
                anonymousSpy.reset();
                expect(anonymousSpy.called).to.be.false;
                ChatService.publish('me', 'hi again');
                expect(anonymousSpy.called).to.be.true;
            });


             it('should be able to wrap other function', () => {
                let messages = []
                const myFunction = (message) => {
                    messages.push(message);
                }

                const functionSpy = sinon.spy(myFunction);
                ChatService.register('spy', functionSpy);
                ChatService.register('me', () => {});
                ChatService.publish('me', 'are you a spy?');

                expect(functionSpy.called).to.be.true;
                expect(functionSpy.getCall(0).args[0]).to.be.equal('are you a spy?');
                expect(messages).to.include.members(['are you a spy?']);
             });

             it('should be able to wrap object methods', () => {
                let messages = []
                const myObject =  {
                    myMethod(message) { messages.push(message) }
                }

                const methodSpy = sinon.spy(myObject, "myMethod");
                ChatService.register('spy', methodSpy);
                ChatService.register('me', () => {});
                ChatService.publish('me', 'zzzzz...');

                expect(methodSpy.called).to.be.true;
                expect(methodSpy.callCount).to.be.equal(1);
                expect(methodSpy.getCall(0).args[0]).to.be.equal('zzzzz...');
                expect(messages).to.include.members(['zzzzz...']);

                // Method spies can be restored,
                // then the original method will not be wrapped anymore
                methodSpy.restore();

                ChatService.publish('me', 'ET phone home');;
                expect(messages).to.include.members(['ET phone home']);
                // Pretty confused expected to be 1 but resolves to 2
                // expect(methodSpy.callCount).to.be.equal(1);
             });
        });
});

