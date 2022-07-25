import {create} from '../index.mjs';

describe('proxy', function() {
	let obj, state;
	beforeEach(function() {
		obj = {
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
		};
		state = create(obj);
	});

	it('should get atom', () => state.atom.should.equal(0));
	it('should get deep', () => state.obj.array[0].atom.should.equal(0));

	it('should set atom', () => {
		state.atom = 1;
		obj.atom.should.equal(1);
	});
	it('should set deep', () => {
		state.obj.array[0].atom = 1;
		obj.obj.array[0].atom.should.equal(1);
	});

	it('should set subObj', () => {
		const set = {
			atom: 1,
			obj: {atom: 2},
			array: [{
				atom: 3,
				obj: {atom: 4},
				array: [5],
			}],
		};
		state.obj = set;
		obj.obj.should.deep.equal(set);
		(obj.obj === set).should.be.false;
	});

	it('should add property', () => {
		const set = {
			atom: 1,
			obj: {atom: 2, foo: 'bar'},
			array: [{
				atom: 3,
				obj: {atom: 4},
				array: [5],
			}],
		};
		state.obj = set;
		obj.obj.should.deep.equal(set);
		(obj.obj === set).should.be.false;
	});

	it('should remove property', () => {
		const set = {
			obj: {atom: 2},
			array: [{
				atom: 3,
				obj: {atom: 4},
				array: [5],
			}],
		};
		state.obj = set;
		obj.obj.should.deep.equal(set);
		(obj.obj === set).should.be.false;
	});
});
