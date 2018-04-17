class Game {
	constructor() {
		this.board_ = new Board();
		this.players_ = ['x', 'o'];
		this.currentPlayer_ = 0;
		this.init_();
	}

	reset_() {
		this.board_.reset();
		this.currentPlayer_ = 0;
		this.updateStatus_();
	}

	init_() {
		const table = document.getElementById('game');
		const cells = table.getElementsByTagName('td');
		if (cells.length != 9) {
			return;
		}
		for (let i = 0; i < 9; i++) {
			const cell = cells[i];
			cell.onclick = () => {
				this.attemptMove_(Math.floor(i/3), i%3);
				this.updateStatus_();
			}
		}
		const reset = document.getElementById('restart');
		reset.onclick = () => this.reset_();
		this.reset_();
	}

	attemptMove_(x, y) {
		const player = this.players_[this.currentPlayer_]; 
		if (this.board_.isGameOver()) {
			return;
		} else if (this.board_.move(x, y, player)) {
			this.currentPlayer_ = 1 - this.currentPlayer_;
		}
	}

	updateStatus_() {
		const status = document.getElementById('status');
		if (this.board_.hasWon('x')) {
			status.innerHTML = 'Player 1 wins!';
		} else if (this.board_.hasWon('o')) {
			status.innerHTML = 'Player 2 wins!';
		} else if (this.board_.isGameOver()) {
			status.innerHTML = 'Game ended in a tie!';
		} else {
			status.innerHTML = 'Player ' + (this.currentPlayer_ + 1) + ' turn!';
		}
	}
}

window.onload = () => new Game();