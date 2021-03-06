const Board = require('../../src/board');
const jsdom = require('jsdom');

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
		expect(b.isGameOver()).toBeFalsy();
	});

	it('isGameOver is true - x wins', () => {
		b.board_ = [['x', 'x', 'x'], ['o', 'o', '-'], ['-', '-', '-']];
		expect(b.isGameOver()).toBeTruthy();
	});

	it('isGameOver is true - o wins', () => {
		b.board_ = [['x', 'x', '-'], ['o', 'o', 'o'], ['-', '-', '-']];
		expect(b.isGameOver()).toBeTruthy();
	});

	it('isGameOver is true - full', () => {
		b.board_ = [['x', 'x', 'o'], ['o', 'o', 'x'], ['x', 'o', 'x']];
		expect(b.isGameOver()).toBeTruthy();
	});

	it('hasWon - horizontal', () => {
		b.board_ = [['x', 'x', 'x'], ['o', 'o', '-'], ['-', '-', '-']];
		expect(b.hasWon('x')).toBeTruthy();
		expect(b.hasWon('o')).toBeFalsy();
		b.board_ = [['o', 'o', '-'], ['x', 'x', 'x'], ['-', '-', '-']];
		expect(b.hasWon('x')).toBeTruthy();
		expect(b.hasWon('o')).toBeFalsy();
		b.board_ = [['o', 'o', '-'], ['-', '-', '-'], ['x', 'x', 'x']];
		expect(b.hasWon('x')).toBeTruthy();
		expect(b.hasWon('o')).toBeFalsy();
	});

	it('hasWon - vertical', () => {
		b.board_ = [['o', '-', 'x'], ['o', 'x', '-'], ['o', 'x', '-']];
		expect(b.hasWon('o')).toBeTruthy();
		expect(b.hasWon('x')).toBeFalsy();
		b.board_ = [['x', 'o', '-'], ['x', 'o', 'x'], ['-', 'o', '-']];
		expect(b.hasWon('o')).toBeTruthy();
		expect(b.hasWon('x')).toBeFalsy();
		b.board_ = [['x', 'o', 'o'], ['-', '-', 'o'], ['x', 'x', 'o']];
		expect(b.hasWon('o')).toBeTruthy();
		expect(b.hasWon('x')).toBeFalsy();
	});

	it('hasWon - diagonal', () => {
		b.board_ = [['x', '-', 'o'], ['o', 'x', '-'], ['o', '-', 'x']];
		expect(b.hasWon('x')).toBeTruthy();
		expect(b.hasWon('o')).toBeFalsy();
		b.board_ = [['-', 'x', 'o'], ['x', 'o', '-'], ['o', '-', 'x']];
		expect(b.hasWon('o')).toBeTruthy();
		expect(b.hasWon('x')).toBeFalsy();
	});

	it('isEmpty is true', () => {
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				expect(b.isEmpty_(i, j)).toBeTruthy();
			}
		}
	});

	it('isEmpty is false', () => {
		b.board_ = [['x', 'x', 'o'], ['o', 'o', 'x'], ['x', 'o', 'x']];
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				expect(b.isEmpty_(i, j)).toBeFalsy();
			}
		}
		expect(b.isEmpty_(-1, 0)).toBeFalsy();
		expect(b.isEmpty_(0, -1)).toBeFalsy();
		expect(b.isEmpty_(3, 0)).toBeFalsy();
		expect(b.isEmpty_(0, 3)).toBeFalsy();
		expect(b.isEmpty_(3, 3)).toBeFalsy();
	});

	it('reset', () => {
		b.board_ = [['x', 'x', 'o'], ['o', 'o', 'x'], ['x', 'o', 'x']];
		b.reset();
		expect(b.board_).toEqual([['-', '-', '-'], ['-', '-', '-'], ['-', '-', '-']]);
	});

	it('move is true', () => {
		expect(b.move(0, 0, 'x')).toBeTruthy();
		expect(b.board_).toEqual([['x', '-', '-'], ['-', '-', '-'], ['-', '-', '-']]);
		expect(b.move(1, 1, 'o')).toBeTruthy();
		expect(b.board_).toEqual([['x', '-', '-'], ['-', 'o', '-'], ['-', '-', '-']]);
		expect(b.move(2, 1, 'x')).toBeTruthy();
		expect(b.board_).toEqual([['x', '-', '-'], ['-', 'o', '-'], ['-', 'x', '-']]);
		expect(b.move(1, 0, 'x')).toBeTruthy();
		expect(b.board_).toEqual([['x', '-', '-'], ['x', 'o', '-'], ['-', 'x', '-']]);
	});

	it('move is false', () => {
		b.board_ = [['x', '-', '-'], ['-', '-', '-'], ['-', '-', '-']];
		expect(b.move(0, 0, 'x')).toBeFalsy();
		expect(b.move(0, 0, 'o')).toBeFalsy();
		expect(b.move(0, 0, '-')).toBeFalsy();
		expect(b.move(1, 3, 'o')).toBeFalsy();
		expect(b.move(3, 1, 'o')).toBeFalsy();
		expect(b.move(1, -1, 'o')).toBeFalsy();
		expect(b.move(-1, 1, 'o')).toBeFalsy();
		expect(b.move(1, 1, 'y')).toBeFalsy();
		b.board_ = [['x', '-', '-'], ['x', '-', '-'], ['x', '-', '-']];
		expect(b.move(1, 1, 'o')).toBeFalsy();
		expect(b.move(2, 2, 'o')).toBeFalsy();
	});

	it('move DOM updates', () => {
		const table = document.getElementById('game');
		const cells = table.getElementsByTagName('td');
		expect(cells[0].innerHTML).toBe('');
		expect(b.move(0, 0, 'x')).toBeTruthy();
		expect(cells[0].innerHTML).toBe('x');
		expect(b.move(0, 0, 'o')).toBeFalsy();
		expect(cells[0].innerHTML).toBe('x');
		expect(b.move(0, 1, 'o')).toBeTruthy();
		expect(cells[1].innerHTML).toBe('o');
		expect(b.move(1, 1, 'x')).toBeTruthy();
		expect(cells[4].innerHTML).toBe('x');
		expect(b.move(1, 2, 'o')).toBeTruthy();
		expect(cells[5].innerHTML).toBe('o');
		expect(b.move(2, 2, 'x')).toBeTruthy();
		expect(cells[8].innerHTML).toBe('x');
		expect(b.move(2, 0, 'o')).toBeFalsy();
		expect(cells[6].innerHTML).toBe('');
		expect(b.move(2, 0, 'x')).toBeFalsy();
		expect(cells[6].innerHTML).toBe('');
		expect(b.move(2, 1, 'o')).toBeFalsy();
		expect(cells[7].innerHTML).toBe('');
	});

	it('move with invalid table or invalid cells', () => {
		expect(b.move(0, 0, 'x')).toBeTruthy();
		document.body.innerHTML = '<table id="game"><tr><td></td></tr></table>';
		expect(b.move(1, 1, 'x')).toBeTruthy();
	});
});
