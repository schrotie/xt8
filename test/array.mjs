import {create, plain} from '../index.mjs';

describe('array', function() {
	let state;
	beforeEach(function() {
		state = create([0]);
		state.splice(0, 3, 0, 1, 2);
	});

	it('should initialize', () =>	plain(state).should.deep.equal([0, 1, 2]));

	it('should proxy entries', () => {
		const arr = [];
		for(const el of state.entries()) arr.push(el);
		arr.should.deep.equal([[0, 0], [1, 1], [2, 2]]);
	});

	it('should proxy keys', () => {
		const arr = [];
		for(const el of state.keys()) arr.push(el);
		arr.should.deep.equal([0, 1, 2]);
	});

	it('should proxy iterator', () => {
		const arr = [];
		for(const el of state) arr.push(el);
		arr.should.deep.equal([0, 1, 2]);
	});

	it('should proxy length', () => state.length.should.equal(3));

	it('should proxy at', () => state.at(1).should.equal(1));

	it('should proxy find', () => state.find(el => el === 1).should.equal(1));

	it.skip('should proxy findLast',
		() => state.findLast(() => 1).should.equal(2));

	it('should proxy forEach', () => {
		const arr = [];
		state.forEach(e => arr.push(e));
		arr.should.deep.equal([0, 1, 2]);
	});

	it('should proxy concat', () => {
		state.concat([3, 4]).should.deep.equal([0, 1, 2, 3, 4]);
	});

	it('should proxy push', () => {
		state.push(3, 4).should.equal(5);
		plain(state).should.deep.equal([0, 1, 2, 3, 4]);
	});

	it('should proxy unshift', () => {
		state.unshift(-1).should.equal(4);
		plain(state).should.deep.equal([-1, 0, 1, 2]);
	});

	it('should proxy pop', () => {
		state.pop().should.equal(2);
		plain(state).should.deep.equal([0, 1]);
		state.pop();
		state.pop();
		(state.pop() === undefined).should.be.true;
	});

	it('should proxy shift', () => {
		state.shift().should.equal(0);
		plain(state).should.deep.equal([1, 2]);
	});

	it('should proxy copyWithin', () => {
		plain(state.copyWithin(-1)).should.deep.equal([0, 1, 0]);
	});

	it('should proxy fill', () => {
		plain(state.fill(3, -2, -1)).should.deep.equal([0, 3, 2]);
		plain(state.fill(3)).should.deep.equal([3, 3, 3]);
		plain(state.fill(4, 0, 5)).should.deep.equal([4, 4, 4]);
		plain(state.fill(5, 0, 3)).should.deep.equal([5, 5, 5]);
		state.splice(0);
		plain(state.fill(3)).should.deep.equal([]);
	});

	it('should proxy reverse', () => {
		plain(state.reverse()).should.deep.equal([2, 1, 0]);
	});

	it('should proxy sort', () => {
		plain(state.sort((a, b) => b - a)).should.deep.equal([2, 1, 0]);
		state.splice(0, 3, 0, 1, 0);
		plain(state.sort()).should.deep.equal([0, 0, 1]);
	});

	it('should proxy splice', () => {
		state.splice(-1).should.deep.equal([2]);
		plain(state).should.deep.equal([0, 1]);
		state.splice(2, 0, 2, 3).should.deep.equal([]);
		plain(state).should.deep.equal([0, 1, 2, 3]);
		state.splice(1, 2, 4, 5).should.deep.equal([1, 2]);
		plain(state).should.deep.equal([0, 4, 5, 3]);
	});
});
