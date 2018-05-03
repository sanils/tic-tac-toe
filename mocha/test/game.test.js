const Game = require('../../src/game');
const assert = require('assert');
const jsdom = require('jsdom');
const sinon = require('sinon');

describe('Game', () => {
	let g, cells, hasWonStub, moveStub, isGameOverStub, resetStub, board;

	const verifyStatus = (expectedStatus) => {
		const status = document.getElementById('status');
		assert.equal(status.innerHTML, expectedStatus);
	};

	const updateDom = (domString) => {
		const dom = new jsdom.JSDOM('<html><body>' + domString + '</body></html>');
		global.document = dom.window.document;
	}

	beforeEach(() => {
		const domString =
			`<ul id="menu"><li id="status"></li><li id="restart"></li></ul>
			<table id="game">
				<tr><td></td><td></td><td></td></tr>
				<tr><td></td><td></td><td></td></tr>
				<tr><td></td><td></td><td></td></tr>
			</table>`;
		updateDom(domString);
		cells = document.getElementsByTagName('td');

		hasWonStub = sinon.stub();
		moveStub = sinon.stub();
		isGameOverStub = sinon.stub();
		resetStub = sinon.stub();
		board = {
			hasWon: hasWonStub, move: moveStub, isGameOver: isGameOverStub, reset: resetStub,
		};
	});

	it('Game initialization', () => {
		g = new Game(board);
		assert(resetStub.called);
		assert.equal(g.currentPlayer_, 0);
		verifyStatus('Player 1 turn!');
	});

	it('Game initialization - error', () => {
		updateDom('<table id="game"><tr><td></td></tr>');
		assert.throws(() => new Game(board), new Error('Incorrect DOM setup'));
		const table =
			`<table id="game">
				<tr><td></td><td></td><td></td></tr>
				<tr><td></td><td></td><td></td></tr>
				<tr><td></td><td></td><td></td></tr>
			</table>`;
		updateDom('<ul id="menu"><li id="status"></li></ul>' + table);
		assert.throws(() => new Game(board), new Error('Incorrect DOM setup'));
		updateDom('<ul id="menu"><li id="restart"></li></ul>' + table);
		assert.throws(() => new Game(board), new Error('Incorrect DOM setup'));
	});

	it('No move if game over', () => {
		isGameOverStub.returns(true);
		g = new Game(board);
		cells[0].click();
		assert.equal(g.currentPlayer_, 0);
		assert(moveStub.notCalled);
	});

	it('No player change if move is false', () => {
		g = new Game(board);
		assert.equal(g.currentPlayer_, 0);
		cells[0].click();
		assert(isGameOverStub.called);
		assert(moveStub.called);
		assert.equal(g.currentPlayer_, 0);
	});

	it('Tie Game', () => {
		isGameOverStub.returns(true);
		g = new Game(board);
		assert.equal(hasWonStub.callCount, 2);
		assert(isGameOverStub.called);
		verifyStatus('Game ended in a tie!');
	});

	it('Player 1 wins', () => {
		hasWonStub.returns(true);
		g = new Game(board);
		assert(hasWonStub.called);
		assert.equal(hasWonStub.args[0][0], 'x');
		assert(isGameOverStub.notCalled);
		verifyStatus('Player 1 wins!');
	});

	it('Player 2 wins', () => {
		hasWonStub.onCall(0).returns(false);
		hasWonStub.onCall(1).returns(true);
		g = new Game(board);
		assert.equal(hasWonStub.callCount, 2);
		assert.equal(hasWonStub.args[0][0], 'x');
		assert.equal(hasWonStub.args[1][0], 'o');
		assert(isGameOverStub.notCalled);
		verifyStatus('Player 2 wins!');
	});

	it('Click cell calls correct move', () => {
		moveStub.returns(true);
		g = new Game(board);
		for (let i = 0; i < cells.length; i++) {
			cells[i].click();
		}
		assert.equal(moveStub.callCount, 9);
		assert.deepEqual(moveStub.getCall(0).args, [0, 0, 'x']);
		assert.deepEqual(moveStub.getCall(1).args, [0, 1, 'o']);
		assert.deepEqual(moveStub.getCall(2).args, [0, 2, 'x']);
		assert.deepEqual(moveStub.getCall(3).args, [1, 0, 'o']);
		assert.deepEqual(moveStub.getCall(4).args, [1, 1, 'x']);
		assert.deepEqual(moveStub.getCall(5).args, [1, 2, 'o']);
		assert.deepEqual(moveStub.getCall(6).args, [2, 0, 'x']);
		assert.deepEqual(moveStub.getCall(7).args, [2, 1, 'o']);
		assert.deepEqual(moveStub.getCall(8).args, [2, 2, 'x']);
	});

	it('Restart after one turn', () => {
		moveStub.returns(true);
		g = new Game(board);
		assert(resetStub.called);
		resetStub.reset();
		verifyStatus('Player 1 turn!');
		cells[0].click();
		assert(moveStub.called);
		assert.equal(g.currentPlayer_, 1);
		verifyStatus('Player 2 turn!');
		document.getElementById('restart').click();
		assert(resetStub.called);
		assert.equal(g.currentPlayer_, 0);
		verifyStatus('Player 1 turn!');
	});
});