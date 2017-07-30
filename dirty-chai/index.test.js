const { expect, use } = require('chai');
const dirtyChai = require('dirty-chai');

describe('What Dirty Chai Does', () => {

  describe('Chai API vanilla version', () => {

    describe('Chai property based assertions', () => {

      it('should provide API \'ok\' as property', () => {
        expect('some value').to.ok;
      })

      it('should provide API \'true\' as property', () => {
        expect(true).to.true;
      })

      it('should provide API \'false\' as property', () => {
        expect(false).to.false;
      })

      it('should provide API \'null\' as property', () => {
        const fruit = { name: null };
        expect(fruit.name).to.null;
      })

      it('should provide API \'undefined\' as property', () => {
        const fruit = { name: 'banana' };
        expect(fruit.color).to.undefined;
      })

      it('should provide API \'exist\' as property', () => {
        expect('some value').to.exist;
        expect(null).to.not.exist;
      })

      it('should provide API \'empty\' as property', () => {
        expect([]).to.empty;
        expect([null, null]).to.not.empty;
      })

      it('should provide API \'arguments\' as property', () => {
        function test() {
          expect(arguments).to.arguments
        }
        test(1);
      })
    })

  })

  describe('Chai API using Dirty-Chai', () => {

    before(() => {
      use(dirtyChai)
    })

    describe('Dirty Chai overrides property based assertions', () => {

      it('should provide API \'ok\' as function', () => {
        expect('some value').to.ok();
      })

      it('should API \'true\' as function', () => {
        expect(true).to.true();
      })

      it('should API \'false\' as function', () => {
        expect(false).to.false();
      })

      it('should provide API \'null\' as property', () => {
        const fruit = { name: null };
        expect(fruit.name).to.null();
      })

      it('should provide API \'undefined\' as function', () => {
        const fruit = { name: 'Banana' };
        expect(fruit.color).to.undefined();
      })

      it('should provide API \'exist\' as function', () => {
        expect('some value').to.exist;
        expect(null).to.not.exist;
      })

      it('should provide API \'empty\' as property', () => {
        expect([]).to.empty();
        expect([null, null]).to.not.empty();
      })

      it('should provide API \'arguments\' as property', () => {
        function test() {
          expect(arguments).to.arguments()
        }
        test(1);
      })

    })

  })

})