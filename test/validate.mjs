import {
	create,
	mustHave,
	mustHaveValidator,
	mustHaveOwn,
	mustHaveOwnValidator,
	addPropOnlyArray,
	addPropOnlyArrayValidator,
	delPropOnlyArray,
	delPropOnlyArrayValidator,
	sameType,
	sameTypeValidator,
	oneOf,
	int,
	intValidator,
	unhookDel,
	unhookGet,
	unhookSet,
} from '../index.mjs';

describe('validator', function() {
	let state, registry;
	const all =  [unhookDel, unhookGet, unhookSet];
	beforeEach(function() {
		class Test {
			constructor() {
				this.atom = 0;
				this.obj = {atom: 0};
				this.array = [0];
			}
			get proto() {return 0;}
		}
		state = create(new Test());
	});
	afterEach(function() {
		for(const unhook of registry.unhooker) unhook(registry.validator);
	});

	function register(hook, validator, ...unhooker) {
		hook();
		registry = {unhooker, validator};
	}

	it('should validate mustHave', function() {
		register(mustHave, mustHaveValidator, ...all);
		state.atom.should.equal(0);
		state.proto.should.equal(0);
		state.array.concat(1).should.deep.equal([0, 1]);
		(() => state.foo).should
			.throw('Cannot access non-existing property "foo"');
	});

	it('should validate mustHaveOwn', function() {
		register(mustHaveOwn, mustHaveOwnValidator, ...all);
		state.atom.should.equal(0);
		(() => state.proto).should
			.throw('Cannot access non-own property "proto"');
	});

	it('should validate addPropOnlyArray', function() {
		register(addPropOnlyArray, addPropOnlyArrayValidator, unhookSet);
		state.array.push(1);
		(() => state.obj.foo = 'foo').should
			.throw('Adding "obj.foo" to store  is not allowed');
	});

	it('should validate delPropOnlyArray', function() {
		register(delPropOnlyArray, delPropOnlyArrayValidator, unhookDel);
		state.array.pop();
		(() => delete state.obj.atom).should
			.throw('Deleting obj.atom from store  is not allowed');
	});

	it('should validate sameType', function() {
		register(sameType, sameTypeValidator, unhookSet);
		state.atom = 1;
		(() => state.atom = '2').should
			.throw('Cannot set string "2" to "atom", must be type number');
	});

	it('should validate oneOf', function() {
		const validator = oneOf('*', [1, 2]);
		registry = {validator: validator, unhooker: [unhookSet]};
		state.atom = 1;
		state.atom = 2;
		(() => state.atom = 3).should
			.throw('Invalid value "3" for "atom", must be one of "1", "2"');
	});

	it('should validate int', function() {
		register(int, intValidator, unhookSet);
		state.atom = 1;
		(() => state.atom = 1.1).should
			.throw('Cannot set number "1.1" to "atom", must be integer');
	});
});

