const assert = require('assert');
const Board = require('../board');

describe('Board', () => {
	let b;
	beforeEach(() => {
		b = new Board();
	});
	it('isGameOver should be false', () => {
		assert.equal(b.isGameOver(), false);
	});
});