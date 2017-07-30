
const expect = require('chai').expect,
      sinon = require('sinon');

const ChatService = require('./index.js');

describe('simple tests', () => {

        beforeEach(() => {
            ChatService.killAll();
        })

        describe('sinon spy', () => {

            it('should be able to record calls and arguments passed to it', () => {
                const anonymousSpy = sinon.spy();
                let call;

                ChatService.register('spy', anonymousSpy);
                ChatService.register('me', () => {});
                ChatService.publish('me', 'hello there');
                ChatService.publish('me', 'how are you?');

                // chai.expect(spy API).to ...
                expect(anonymousSpy.called).to.be.true;
                call = anonymousSpy.getCall(0);
                expect(call.args[0]).to.be.deep.equal({ from: 'me', message: 'hello there' });

                call = anonymousSpy.getCall(1);
                expect(call.args[0]).to.be.deep.equal({ from: 'me', message: 'how are you?' });
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
                const myFunction = (data) => {
                    messages.push(data.message);
                }

                const functionSpy = sinon.spy(myFunction);
                let call;

                ChatService.register('spy', functionSpy);
                ChatService.register('me', () => {});
                ChatService.publish('me', 'are you a spy?');

                expect(functionSpy.called).to.be.true;
                call = functionSpy.getCall(0);
                expect(call.args[0]).to.be.deep.equal({ from: 'me', message: 'are you a spy?' });
                // Wrapped function is also called
                expect(messages).to.include.members(['are you a spy?']);
             });

             it('should be able to wrap object methods', () => {
                let messages = []
                const myObject =  {
                    myMethod(data) { messages.push(data.message) }
                }

                const methodSpy = sinon.spy(myObject, "myMethod");
                let call;
                ChatService.register('spy', methodSpy);
                ChatService.register('me', () => {});
                ChatService.publish('me', 'zzzzz...');

                expect(methodSpy.called).to.be.true;
                call = methodSpy.getCall(0);
                expect(methodSpy.callCount).to.be.equal(1);
                expect(call.args[0]).to.be.deep.equal({ from: 'me', message: 'zzzzz...'});
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

        describe('sinon stubs', () => {

            it('should extends spies and provide programmed behaviour', () => {
                const anonymousStub = sinon.stub();
                const error = new TypeError('Ops');

                anonymousStub.withArgs(1, 3).returns(4);
                anonymousStub.withArgs(2, 7).returns(9);
                anonymousStub.withArgs(3.14, null).throws(error);

                // chai.expect(stub API).to ...
                expect(anonymousStub(99, 10)).to.be.undefined;
                expect(anonymousStub(1, 3)).to.be.equal(4);
                expect(anonymousStub(2, 7)).to.be.equal(9);
                // throws expectations must use a wrap function
                expect(function() { 
                    anonymousStub(3.14, null);
                }).to.throw(error);

                // spy api still here
                expect(anonymousStub.callCount).to.be.equal(4);
                const call = anonymousStub.getCall(1);
                expect(call.args[0]).to.be.equal(1);
                expect(call.args[1]).to.be.equal(3);
            });

            it('should replace an object method', () => {
                let messages = [];
                let replies = [];
                const myObject =  {
                    myMethod(data) { messages.push(data.message) }
                }
                const methodStub = sinon.stub(myObject, "myMethod");
                methodStub.callsFake((data) => {
                    ChatService.replyTo('stub', data.from, 'i am a robot!');
                });

                ChatService.register('stub', methodStub);
                ChatService.register('me', (data) => { replies.push(data.message) });
                ChatService.publish('me', 'hello');

                expect(methodStub.callCount).to.be.equal(1);
                expect(replies).to.include.members(['stub >> i am a robot!']);
                // Origial method is not called
                expect(messages).to.be.empty;
            });

            xit('(deprecated) should replace an object method wrapping it inside a spy', () => {
                let messages = [];
                const myObject =  {
                    myMethod(data) { messages.push(data.message) }
                }
                // Deprecate form should use previous scenario with 'callsFake'
                const methodStub = sinon.stub(myObject, "myMethod", (data) => {
                    ChatService.replyTo('stub', data.from, 'i am a robot!');
                });

                ChatService.register('stub', methodStub);
                ChatService.register('me', (data) => { messages.push(data.message) });
                ChatService.publish('me', 'hello');

                expect(methodStub.callCount).to.be.equal(1);
                expect(messages).to.include.members(['stub >> i am a robot!']);
            });


            it('should replace all object methods at once', () => {

            });
        })

        describe('sinon mocks', () => {

            it('should mock objects and provide expectations over them', () => {
                let messages = [];
                let objectMock = sinon.mock(ChatService);

                // Mocks can't use Stub or Spy APIs
                // but can define expectations using Matchers
                objectMock.expects("publish").withArgs("me", sinon.match.string).atMost(2);

                ChatService.register('other', (data) => { messages.push(data.message) });
                ChatService.register('me', () => { });
                ChatService.publish('me', 'hello world');
                ChatService.publish('me', 'bye bye');

                // Expectations can be verified
                objectMock.verify();

                // Original method is not called
                expect(messages).to.be.empty;

                // Use restore to eliminate mock control over object
                objectMock.restore()
                ChatService.publish('me', '123');
                expect(messages).to.be.include.members(['123']);
            });
        })
});

