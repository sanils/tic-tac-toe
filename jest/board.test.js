const Board = require('./board');

test('isGameOver is false', () => {
	const b = new Board(); 
	expect(b.isGameOver()).toBe(false);
});
