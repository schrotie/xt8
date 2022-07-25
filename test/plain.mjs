import {create, plain} from '../index.mjs';

describe('plain', function() {
	it('should create a deep plain JS copy', function() {
		const obj = {
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
		const state = create(obj);
		const dupe  = plain(create(obj));
		dupe.should.deep.equal(obj);
		(dupe !== state).should.be.true;
		(dupe !== obj).should.be.true;
	});
	});

