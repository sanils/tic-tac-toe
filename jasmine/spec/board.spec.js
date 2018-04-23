const Board = require('../../src/board');

describe('Board', () => {
	let b;
	beforeEach(() => {
		b = new Board();
	});
	it('isGameOver should be false', () => {
		expect(b.isGameOver()).toEqual(false);
	});
});