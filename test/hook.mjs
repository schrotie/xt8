import {
	create,
	hookDel,
	unhookDel,
	hookGet,
	unhookGet,
	hookSet,
	unhookSet,
} from '../index.mjs';

describe('hook', function() {
	let state;
	beforeEach(function() {
		state = create({});
	});

	describe('get', function() {
		afterEach(function() {unhookGet('foo', get1);});
		function get1() {return 'test1';}
		function get2() {return 'test2';}
		it('should return value from hook', function() {
			hookGet('foo', get1);
			state.foo.should.equal('test1');
		});

		it('should throw not-registered hook', function() {
			(() => unhookGet('foo', get2)).should
				.throw('Cannot unhook "foo" - hook not found');
			hookGet('foo', get1);
			(() => unhookGet('foo', get2)).should
				.throw('Cannot unhook "foo" - hook not found');
		});
	});

	describe('set', function() {
		let called;
		beforeEach(function() {called = false;});
		afterEach(function() {unhookSet('foo', set);});
		function set() {return called = true;}
		it('should call setter', function() {
			hookSet('foo', set);
			state.foo = 1;
			called.should.be.true;
		});
	});

	describe('del', function() {
		let called;
		beforeEach(function() {called = false;});
		afterEach(function() {unhookDel('foo', del);});
		function del() {return called = true;}
		it('should call setter', function() {
			hookDel('foo', del);
			delete state.foo;
			called.should.be.true;
		});
	});
});
