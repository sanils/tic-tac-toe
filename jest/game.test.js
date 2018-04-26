jest.mock('../src/board');
const Board = require('../src/board');
const Game = require('../src/game');

let g, hasWonMock, moveMock, isGameOverMock, resetMock;

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
			hasWon: hasWonMock,
			move: moveMock,
			isGameOver: isGameOverMock,
			reset: resetMock,
		};
	});
	document.body.innerHTML =  `
	<ul id="menu"><li id="status"></li><li id="restart"></li></ul>
	<table id="game">
		<tr><td></td><td></td><td></td></tr>
		<tr><td></td><td></td><td></td></tr>
		<tr><td></td><td></td><td></td></tr>
	</table>`;
	g = new Game();
}); 

afterEach(() => {
	g = null;
	jest.clearAllMocks();
});

test('Game initialization', () => {
	expect(resetMock).toHaveBeenCalled();
	expect(g.currentPlayer_).toBe(0);
	verifyStatus('Player 1 turn!');
});
