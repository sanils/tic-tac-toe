jest.mock('../src/board');
const Board = require('../src/board');
const Game = require('../src/game');

let g, hasWonMock, moveMock, isGameOverMock, resetMock, cells;

const verifyStatus = (expectedStatus) => {
	const status = document.getElementById('status');
	expect(status.innerHTML).toBe(expectedStatus);
};

beforeEach(() => {
	hasWonMock = jest.fn();
	moveMock = jest.fn();
	isGameOverMock = jest.fn();
	resetMock = jest.fn();
	Board.mockImplementation(() => {
		return {
			hasWon: hasWonMock, move: moveMock, isGameOver: isGameOverMock, reset: resetMock,
		};
	});
	document.body.innerHTML =  `
	<ul id="menu"><li id="status"></li><li id="restart"></li></ul>
	<table id="game">
		<tr><td></td><td></td><td></td></tr>
		<tr><td></td><td></td><td></td></tr>
		<tr><td></td><td></td><td></td></tr>
	</table>`;
	cells = document.getElementsByTagName('td');
}); 

afterEach(() => {
	g = null;
	jest.clearAllMocks();
});

test('Game initialization', () => {
	g = new Game();
	expect(resetMock).toHaveBeenCalled();
	expect(g.currentPlayer_).toBe(0);
	verifyStatus('Player 1 turn!');
});

test('Tie Game', () => {
	isGameOverMock.mockReturnValue(true);
	g = new Game();
	expect(hasWonMock).toHaveBeenCalledTimes(2);
	expect(isGameOverMock).toHaveBeenCalled();
	verifyStatus('Game ended in a tie!');
});

test('Player 1 wins', () => {
	hasWonMock.mockReturnValue(true);
	g = new Game();
	expect(hasWonMock).toHaveBeenCalled();
	expect(hasWonMock.mock.calls[0][0]).toBe('x');
	expect(isGameOverMock).not.toHaveBeenCalled();
	verifyStatus('Player 1 wins!');
});

test('Player 2 wins', () => {
	hasWonMock.mockReturnValueOnce(false).mockReturnValueOnce(true);
	g = new Game();
	expect(hasWonMock).toHaveBeenCalledTimes(2);
	expect(hasWonMock.mock.calls[0][0]).toBe('x');
	expect(hasWonMock.mock.calls[1][0]).toBe('o');
	expect(isGameOverMock).not.toHaveBeenCalled();
	verifyStatus('Player 2 wins!');
});

test('Click cell calls correct move', () => {
	moveMock.mockReturnValue(true);
	g = new Game();
	for (let i = 0; i < cells.length; i++) {
		cells[i].click();
	}
	expect(moveMock).toHaveBeenCalledTimes(9);
	expect(moveMock.mock.calls[0]).toEqual([0, 0, 'x']);
	expect(moveMock.mock.calls[1]).toEqual([0, 1, 'o']);
	expect(moveMock.mock.calls[2]).toEqual([0, 2, 'x']);
	expect(moveMock.mock.calls[3]).toEqual([1, 0, 'o']);
	expect(moveMock.mock.calls[4]).toEqual([1, 1, 'x']);
	expect(moveMock.mock.calls[5]).toEqual([1, 2, 'o']);
	expect(moveMock.mock.calls[6]).toEqual([2, 0, 'x']);
	expect(moveMock.mock.calls[7]).toEqual([2, 1, 'o']);
	expect(moveMock.mock.calls[8]).toEqual([2, 2, 'x']);
});

test('Restart after one turn', () => {
	moveMock.mockReturnValue(true);
	g = new Game();
	expect(resetMock).toHaveBeenCalled();
	resetMock.mockClear();
	verifyStatus('Player 1 turn!');
	cells[0].click();
	expect(moveMock).toHaveBeenCalled();
	expect(g.currentPlayer_).toBe(1);
	verifyStatus('Player 2 turn!');
	document.getElementById('restart').click();
	expect(resetMock).toHaveBeenCalled();
	expect(g.currentPlayer_).toBe(0);
	verifyStatus('Player 1 turn!');
});
