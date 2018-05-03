const Game = require('../../src/game');
const jsdom = require('jsdom');

describe('Game', () => {
	let g, cells, hasWonSpy, moveSpy, isGameOverSpy, resetSpy, board;
	let verifyStatus;

	beforeEach(() => {
		const domString =
			`<html><body>
				<ul id="menu"><li id="status"></li><li id="restart"></li></ul>
				<table id="game">
					<tr><td></td><td></td><td></td></tr>
					<tr><td></td><td></td><td></td></tr>
					<tr><td></td><td></td><td></td></tr>
				</table>
			</body></html>`;
		const dom = new jsdom.JSDOM(domString);
		global.document = dom.window.document;
		cells = document.getElementsByTagName('td');

		verifyStatus = (expectedStatus) => {
			const status = document.getElementById('status');
			expect(status.innerHTML).toBe(expectedStatus);
		};

		hasWonSpy = jasmine.createSpy('hasWon');
		moveSpy = jasmine.createSpy('move');
		isGameOverSpy = jasmine.createSpy('isGameOver');
		resetSpy = jasmine.createSpy('reset');
		board = {
			hasWon: hasWonSpy, move: moveSpy, isGameOver: isGameOverSpy, reset: resetSpy,
		};
	});

	it('Game initialization', () => {
		g = new Game(board);
		expect(resetSpy).toHaveBeenCalled();
		expect(g.currentPlayer_).toBe(0);
		verifyStatus('Player 1 turn!');
	});

	it('No move if game over', () => {
		isGameOverSpy.and.returnValue(true);
		g = new Game(board);
		cells[0].click();
		expect(g.currentPlayer_).toBe(0);
		expect(moveSpy).not.toHaveBeenCalled();
	});

	it('No player change if move is false', () => {
		g = new Game(board);
		expect(g.currentPlayer_).toBe(0);
		cells[0].click();
		expect(isGameOverSpy).toHaveBeenCalled();
		expect(moveSpy).toHaveBeenCalled();
		expect(g.currentPlayer_).toBe(0);
	});

	it('Tie Game', () => {
		isGameOverSpy.and.returnValue(true);
		g = new Game(board);
		expect(hasWonSpy).toHaveBeenCalledTimes(2);
		expect(isGameOverSpy).toHaveBeenCalled();
		verifyStatus('Game ended in a tie!');
	});

	it('Player 1 wins', () => {
		hasWonSpy.and.returnValue(true);
		g = new Game(board);
		expect(hasWonSpy).toHaveBeenCalled();
		expect(hasWonSpy.calls.argsFor(0)[0]).toBe('x');
		expect(isGameOverSpy).not.toHaveBeenCalled();
		verifyStatus('Player 1 wins!');
	});

	it('Player 2 wins', () => {
		hasWonSpy.and.returnValues(false, true);
		g = new Game(board);
		expect(hasWonSpy).toHaveBeenCalledTimes(2);
		expect(hasWonSpy.calls.argsFor(0)[0]).toBe('x');
		expect(hasWonSpy.calls.argsFor(1)[0]).toBe('o');
		expect(isGameOverSpy).not.toHaveBeenCalled();
		verifyStatus('Player 2 wins!');
	});

	it('Click cell calls correct move', () => {
		moveSpy.and.returnValue(true);
		g = new Game(board);
		for (let i = 0; i < cells.length; i++) {
			cells[i].click();
		}
		expect(moveSpy).toHaveBeenCalledTimes(9);
		expect(moveSpy.calls.argsFor(0)).toEqual([0, 0, 'x']);
		expect(moveSpy.calls.argsFor(1)).toEqual([0, 1, 'o']);
		expect(moveSpy.calls.argsFor(2)).toEqual([0, 2, 'x']);
		expect(moveSpy.calls.argsFor(3)).toEqual([1, 0, 'o']);
		expect(moveSpy.calls.argsFor(4)).toEqual([1, 1, 'x']);
		expect(moveSpy.calls.argsFor(5)).toEqual([1, 2, 'o']);
		expect(moveSpy.calls.argsFor(6)).toEqual([2, 0, 'x']);
		expect(moveSpy.calls.argsFor(7)).toEqual([2, 1, 'o']);
		expect(moveSpy.calls.argsFor(8)).toEqual([2, 2, 'x']);
	});

	it('Restart after one turn', () => {
		moveSpy.and.returnValue(true);
		g = new Game(board);
		expect(resetSpy).toHaveBeenCalled();
		resetSpy.calls.reset();
		verifyStatus('Player 1 turn!');
		cells[0].click();
		expect(moveSpy).toHaveBeenCalled();
		expect(g.currentPlayer_).toBe(1);
		verifyStatus('Player 2 turn!');
		document.getElementById('restart').click();
		expect(resetSpy).toHaveBeenCalled();
		expect(g.currentPlayer_).toBe(0);
		verifyStatus('Player 1 turn!');
	});
});