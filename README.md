# tic-tac-toe

### Game Demo

* The game created is a simple two player tic-tac-toe game where both players are at the same computer.
* Demo for the game can be found [here](https://sanils.github.io/tic-tac-toe/src/game.html).
* The game can be played to ensure correct functionality.
* Actions like playing once the game is over, attempting to play on a full square will be disallowed.
* These edge cases are tested as part of the unit test suite.

### Steps to run unit tests

* Clone this GitHub repository.
* Install node and npm in the tic-tac-toe directory.
* Install node on [Mac](https://treehouse.github.io/installation-guides/mac/node-mac.html).
* Or install node on [Windows](http://blog.teamtreehouse.com/install-node-js-npm-windows).
* Make sure the package.json file remains unchanged from the one in the GitHub repo.
* Run `npm install --save-dev jest jest-cli jsdom mocha jasmine sinon istanbul`
* Run `npm run test_jest`
* Run `npm run test_jasmine`
* Run `npm run test_mocha`

### Steps to run timing analysis tool

* The timing analysis tool can be found in get_time.py
* It is a simple Python script that runs the test suite using each of the test frameworks 5 times.
* It measures that average time taken to run the `npm run <test>` commands across the 5 runs.
* The tool can be run by typing `python get_time.py`.
* The output can be seen in the terminal after each set of 5 runs is complete.
