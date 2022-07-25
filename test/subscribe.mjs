import {create, subscribe, unsubscribe} from '../index.mjs';

describe('subscribe', function() {
	let state, subs;
	beforeEach(function() {
		subs = [];
		state = create({
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
		});
	});
	afterEach(function() {
		for(const {path, callback} of subs) unsubscribe(path, callback);
	});

	function sub(path, done) {
		const callback = function(...arg) {
			arg.should.deep.equal([]);
			done();
		};
		subs.push({path, callback});
		subscribe(path, callback);
	}

	it('should call shallow subscription', function(done) {
		sub('atom', done);
		state.atom = 1;
	});

	it('should call deep subscription', function(done) {
		sub('obj.obj.atom', done);
		state.obj.obj.atom = 1;
	});

	it('should not call wrong subscription', function(done) {
		sub('obj.atom', () => done('this should not be called'));
		sub('obj.obj.atom', done);
		state.obj.obj.atom = 1;
	});

	it('should call parent subscription', function(done) {
		sub('obj', done);
		state.obj.obj.atom = 1;
	});

	it('should keep another evt', function(done) {
		sub('atom', done);
		subscribe('atom', done);
		unsubscribe('atom', done);
		state.atom = 1;
	});

	it('should add global subscription', function(done) {
		const callback = function(...arg) {
			unsubscribe(callback);
			arg.should.deep.equal([]);
			done();
		};
		subscribe(callback);
		state.obj.obj.atom = 1;
	});

	it('should call only once', function(done) {
		sub('atom', done);
		state.atom = 1;
		state.atom = 2;
	});

	it('should ignore unsubscribing non-subscribed', function() {
		unsubscribe('foo', function() {});
	});
});
