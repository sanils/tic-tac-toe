(function() {

class Board {
	constructor() {
		this.board_ = [['-', '-', '-'], ['-', '-', '-'], ['-', '-', '-']];
	}

	reset() {
		this.board_ = [['-', '-', '-'], ['-', '-', '-'], ['-', '-', '-']];
		this.update_();
	}

	move(x, y, p) {
		if (this.isGameOver() || !this.isEmpty_(x, y)) {
			return false;
		} else if (p != 'x' && p != 'o') {
			return false;
		} else { 
			this.board_[x][y] = p;
			this.update_();
			return true;
		}
	}

	isGameOver() {
		if (this.hasWon('x') || this.hasWon('o')) {
			return true;
		}
		return this.board_.every(row => row.indexOf('-') == -1);
	}

	hasWon(p) {
		const winningPositions = [ 
			[[0, 0], [0, 1], [0, 2]],
			[[1, 0], [1, 1], [1, 2]],
			[[2, 0], [2, 1], [2, 2]],
			[[0, 0], [1, 0], [2, 0]],
			[[0, 1], [1, 1], [2, 1]],
			[[0, 2], [1, 2], [2, 2]],
			[[0, 0], [1, 1], [2, 2]],
			[[0, 2], [1, 1], [2, 0]]
		];
		return winningPositions.some((winningPosition) => {
			return winningPosition.every((pos) => {
				return this.board_[pos[0]][pos[1]] == p;
			});
		});
	}

	isEmpty_(x, y) {
		if (x < 0 || x > 2 || y < 0 || y > 2) {
			return false;
		}
		return this.board_[x][y] == '-';
	}

	update_() {
		const table = document.getElementById('game');
		if (table == null) return;
		const cells = table.getElementsByTagName('td');
		if (cells.length != 9) {
			return;
		}
		for (let i = 0; i < 9; i++) {
			const val = this.board_[Math.floor(i/3)][i%3];
			if (val != '-') {
				cells[i].innerHTML = val;
			} else {
				cells[i].innerHTML = '';
			}
		}
	}
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	module.exports = Board;
} else {
	window.Board = Board;
}

})();
