const assert = require('assert');
const jsdom = require('jsdom');
const Board = require('../../src/board');

describe('Board', () => {
	let b;

	beforeEach(() => {
		const domString =
			`<html><body><table id="game">
				<tr><td></td><td></td><td></td></tr>
				<tr><td></td><td></td><td></td></tr>
				<tr><td></td><td></td><td></td></tr>
			</table></body></html>`;
		const dom = new jsdom.JSDOM(domString);
		global.document = dom.window.document;
		b = new Board();
	});

	it('isGameOver should be false', () => {
		assert(!b.isGameOver());
	});

	it('isGameOver is true - x wins', () => {
		b.board_ = [['x', 'x', 'x'], ['o', 'o', '-'], ['-', '-', '-']];
		assert(b.isGameOver());
	});

	it('isGameOver is true - o wins', () => {
		b.board_ = [['x', 'x', '-'], ['o', 'o', 'o'], ['-', '-', '-']];
		assert(b.isGameOver());
	});

	it('isGameOver is true - full', () => {
		b.board_ = [['x', 'x', 'o'], ['o', 'o', 'x'], ['x', 'o', 'x']];
		assert(b.isGameOver());
	});

	it('hasWon - horizontal', () => {
		b.board_ = [['x', 'x', 'x'], ['o', 'o', '-'], ['-', '-', '-']];
		assert(b.hasWon('x'));
		assert(!b.hasWon('o'));
		b.board_ = [['o', 'o', '-'], ['x', 'x', 'x'], ['-', '-', '-']];
		assert(b.hasWon('x'));
		assert(!b.hasWon('o'));
		b.board_ = [['o', 'o', '-'], ['-', '-', '-'], ['x', 'x', 'x']];
		assert(b.hasWon('x'));
		assert(!b.hasWon('o'));
	});

	it('hasWon - vertical', () => {
		b.board_ = [['o', '-', 'x'], ['o', 'x', '-'], ['o', 'x', '-']];
		assert(b.hasWon('o'));
		assert(!b.hasWon('x'));
		b.board_ = [['x', 'o', '-'], ['x', 'o', 'x'], ['-', 'o', '-']];
		assert(b.hasWon('o'));
		assert(!b.hasWon('x'));
		b.board_ = [['x', 'o', 'o'], ['-', '-', 'o'], ['x', 'x', 'o']];
		assert(b.hasWon('o'));
		assert(!b.hasWon('x'));
	});

	it('hasWon - diagonal', () => {
		b.board_ = [['x', '-', 'o'], ['o', 'x', '-'], ['o', '-', 'x']];
		assert(b.hasWon('x'));
		assert(!b.hasWon('o'));
		b.board_ = [['-', 'x', 'o'], ['x', 'o', '-'], ['o', '-', 'x']];
		assert(b.hasWon('o'));
		assert(!b.hasWon('x'));
	});

	it('isEmpty is true', () => {
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				assert(b.isEmpty_(i, j));
			}
		}
	});

	it('isEmpty is false', () => {
		b.board_ = [['x', 'x', 'o'], ['o', 'o', 'x'], ['x', 'o', 'x']];
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				assert(!b.isEmpty_(i, j));
			}
		}
		assert(!b.isEmpty_(-1, 0));
		assert(!b.isEmpty_(0, -1));
		assert(!b.isEmpty_(3, 0));
		assert(!b.isEmpty_(0, 3));
		assert(!b.isEmpty_(3, 3));
	});

	it('reset', () => {
		b.board_ = [['x', 'x', 'o'], ['o', 'o', 'x'], ['x', 'o', 'x']];
		b.reset();
		assert.deepEqual(b.board_, [['-', '-', '-'], ['-', '-', '-'], ['-', '-', '-']]);
	});

	it('move is true', () => {
		assert(b.move(0, 0, 'x'));
		assert.deepEqual(b.board_, [['x', '-', '-'], ['-', '-', '-'], ['-', '-', '-']]);
		assert(b.move(1, 1, 'o'));
		assert.deepEqual(b.board_, [['x', '-', '-'], ['-', 'o', '-'], ['-', '-', '-']]);
		assert(b.move(2, 1, 'x'));
		assert.deepEqual(b.board_, [['x', '-', '-'], ['-', 'o', '-'], ['-', 'x', '-']]);
		assert(b.move(1, 0, 'x'));
		assert.deepEqual(b.board_, [['x', '-', '-'], ['x', 'o', '-'], ['-', 'x', '-']]);
	});

	it('move is false', () => {
		b.board_ = [['x', '-', '-'], ['-', '-', '-'], ['-', '-', '-']];
		assert(!b.move(0, 0, 'x'));
		assert(!b.move(0, 0, 'o'));
		assert(!b.move(0, 0, '-'));
		assert(!b.move(1, 3, 'o'));
		assert(!b.move(3, 1, 'o'));
		assert(!b.move(1, -1, 'o'));
		assert(!b.move(-1, 1, 'o'));
		assert(!b.move(1, 1, 'y'));
		b.board_ = [['x', '-', '-'], ['x', '-', '-'], ['x', '-', '-']];
		assert(!b.move(1, 1, 'o'));
		assert(!b.move(2, 2, 'o'));
	});

	it('move DOM updates', () => {
		const table = document.getElementById('game');
		const cells = table.getElementsByTagName('td');
		assert.equal(cells[0].innerHTML, '');
		assert(b.move(0, 0, 'x'));
		assert.equal(cells[0].innerHTML, 'x');
		assert(!b.move(0, 0, 'o'));
		assert.equal(cells[0].innerHTML, 'x');
		assert(b.move(0, 1, 'o'));
		assert.equal(cells[1].innerHTML, 'o');
		assert(b.move(1, 1, 'x'));
		assert.equal(cells[4].innerHTML, 'x');
		assert(b.move(1, 2, 'o'));
		assert.equal(cells[5].innerHTML, 'o');
		assert(b.move(2, 2, 'x'));
		assert.equal(cells[8].innerHTML, 'x');
		assert(!b.move(2, 0, 'o'));
		assert.equal(cells[6].innerHTML, '');
		assert(!b.move(2, 0, 'x'));
		assert.equal(cells[6].innerHTML, '');
		assert(!b.move(2, 1, 'o'));
		assert.equal(cells[7].innerHTML, '');
	});

	it('move with invalid table or invalid cells', () => {
		assert(b.move(0, 0, 'x'));
		document.body.innerHTML = '<table id="game"><tr><td></td></tr></table>';
		assert(b.move(1, 1, 'x'));
	});
});
