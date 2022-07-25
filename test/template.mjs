import {configureTemplate, create, plain} from '../index.mjs';

describe('template', function() {
	let obj, revert, state;
	before(function() {
		revert = configureTemplate({
			atom: 0,
			obj: {
				atom: 0,
				obj: {atom: 0},
				array: [{
					atom: 0,
					obj: {atom: 0},
					array: [0],
				}],
			},
			array: [{
				atom: 0,
				obj: {atom: 0},
				array: [0],
			}],
			nestedArray: [[0]],
		});
	});
	after(() => revert());
	beforeEach(function() {
		obj = {};
		state = create(obj);
	});

	it('should get atom', () => (state.atom === null).should.be.true);

	it('should get from object', function() {
		obj.atom = 42;
		state.atom.should.equal(42);
	});

	it('should get deep object', () => (state.obj.atom === null).should.be.true);
	it('should get deep array',
		() => plain(state.array).should.deep.equal([]),
	);

	it('should set deep', function() {
		state.obj.atom = 42;
		obj.obj.atom.should.equal(42);
	});

	it('should set deep obj', function() {
		state.obj.obj = {atom: 42};
		obj.obj.obj.should.deep.equal({atom: 42});
	});

	it('should set array', function() {
		state.array.push({atom: 42});
		obj.array.should.deep.equal([{atom: 42}]);
	});

	it('should set nested array', function() {
		state.nestedArray.push([0]);
		obj.nestedArray.should.deep.equal([[0]]);
	});

	it('should throw invalid property', function() {
		(() => state.foo).should.throw('Cannot access unknown property "foo"');
	});

	it('should throw invalid type', function() {
		(() => state.atom = '0').should
			.throw('Cannot set invalid type "string" ("0") to path "atom"');
	});

	it('should throw invalid index', function() {
		(() => state.array[1] = {atom: 42}).should
			.throw('Cannot set invalid index "array.1"');
	});

	it('should throw invalid array type', function() {
		(() => state.array.push({atom: ''})).should
			.throw('Cannot set invalid type "string" ("") to path "array.0.atom"');
	});

});
