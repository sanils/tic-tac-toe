const Board = require('../src/board');

let b;

beforeEach(() => {
	b = new Board();
});

afterEach(() => {
	b = null;
});

test('isGameOver is false', () => {
	expect(b.isGameOver()).toBeFalsy();
});

test('isGameOver is true - x wins', () => {
	b.board_ = [['x', 'x', 'x'], ['o', 'o', '-'], ['-', '-', '-']];
	expect(b.isGameOver()).toBeTruthy();
});

test('isGameOver is true - o wins', () => {
	b.board_ = [['x', 'x', '-'], ['o', 'o', 'o'], ['-', '-', '-']];
	expect(b.isGameOver()).toBeTruthy();
});

test('isGameOver is true - full', () => {
	b.board_ = [['x', 'x', 'o'], ['o', 'o', 'x'], ['x', 'o', 'x']];
	expect(b.isGameOver()).toBeTruthy();
});

test('hasWon- horizontal', () => {
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

test('hasWon- vertical', () => {
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

test('hasWon- diagonal', () => {
	b.board_ = [['x', '-', 'o'], ['o', 'x', '-'], ['o', '-', 'x']];
	expect(b.hasWon('x')).toBeTruthy();
	expect(b.hasWon('o')).toBeFalsy();
	b.board_ = [['-', 'x', 'o'], ['x', 'o', '-'], ['o', '-', 'x']];
	expect(b.hasWon('o')).toBeTruthy();
	expect(b.hasWon('x')).toBeFalsy();
});

test('isEmpty is true', () => {
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			expect(b.isEmpty_(i, j)).toBeTruthy();
		}
	}
});

test('isEmpty is false', () => {
	b.board_ = [['x', 'x', 'o'], ['o', 'o', 'x'], ['x', 'o', 'x']];
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			expect(b.isEmpty_(i, j)).toBeFalsy();
		}
	}
});

test('reset', () => {
	b.board_ = [['x', 'x', 'o'], ['o', 'o', 'x'], ['x', 'o', 'x']];
	b.reset();
	expect(b.board_).toEqual([['-', '-', '-'], ['-', '-', '-'], ['-', '-', '-']]);
});
