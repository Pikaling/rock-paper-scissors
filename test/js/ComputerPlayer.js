/**
 * Created by vickidunlop on 09/10/2014.
 */

QUnit.module("Computer player", {
    setup: function() {
        this.model = new GameModel();
        this.player = new ComputerPlayer(this.model);
    }
});

QUnit.test("Plays a gesture on their turn", function(assert) {
    this.player.playTurn();
    var gesture = this.player.getCurrentGesture();
    assert.ok(this.model.getGestures().hasOwnProperty(gesture), "Computer player should play one of the model's gestures on their turn");
});

QUnit.test("Stores their opponent's move history", function(assert) {
   this.player.addOpponentPreviousGesture("rock");
    assert.deepEqual(this.player.opponentGestureHistory[0], "rock", "Computer player should have reference to previous move");
});

QUnit.test("If there is 1 move in the history, the search pattern length is 0", function(assert) {
    this.player.addOpponentPreviousGesture("rock");
    assert.deepEqual(this.player.getPatternLength(), 0, "Pattern length should be 0");
});

QUnit.test("If there are 2 moves in the history, the search pattern length is 1", function(assert) {
    this.player.addOpponentPreviousGesture("rock");
    this.player.addOpponentPreviousGesture("rock");
    assert.deepEqual(this.player.getPatternLength(), 1, "Pattern length should be 1");
});

QUnit.test("If there are 6 moves in the history, the search pattern length is 4", function(assert) {
    this.player.addOpponentPreviousGesture("rock");
    this.player.addOpponentPreviousGesture("rock");
    this.player.addOpponentPreviousGesture("rock");
    this.player.addOpponentPreviousGesture("rock");
    this.player.addOpponentPreviousGesture("rock");
    this.player.addOpponentPreviousGesture("rock");
    assert.deepEqual(this.player.getPatternLength(), 4, "Pattern length should be 4");
});

QUnit.test("If there are 5 moves in the history, the search pattern length is 4", function(assert) {
    this.player.addOpponentPreviousGesture("rock");
    this.player.addOpponentPreviousGesture("rock");
    this.player.addOpponentPreviousGesture("rock");
    this.player.addOpponentPreviousGesture("rock");
    this.player.addOpponentPreviousGesture("rock");
    assert.deepEqual(this.player.getPatternLength(), 4, "Pattern length should be 4");
});

QUnit.test("If there is 1 move in the history, the computer won't look for a pattern", function(assert) {
    this.player.addOpponentPreviousGesture("rock");
    this.spy(this.player, "matchPattern");
    this.player.playTurn();
    assert.deepEqual(this.player.matchPattern.callCount, 0, "Computer player should not look for pattern if there's only 1 move in history");
});

QUnit.test("If there are 2 moves in the history, the computer will look for a pattern", function(assert) {
    this.player.addOpponentPreviousGesture("rock");
    this.player.addOpponentPreviousGesture("rock");
    this.spy(this.player, "matchPattern");
    this.player.playTurn();
    assert.deepEqual(this.player.matchPattern.callCount, 1, "Computer player should look for pattern if there's more than 1 move in history");
});

QUnit.test("If the opponent played the same move for the first 2 turns, expect a prediction of the same move", function(assert) {
    this.player.addOpponentPreviousGesture("rock");
    this.player.addOpponentPreviousGesture("rock");
    this.spy(this.player, "matchPattern");
    this.player.playTurn();
    assert.ok(this.player.matchPattern.returned(["rock"]));
});

QUnit.test("If the opponent played the same move for the first 3 turns, expect a prediction of the same move", function(assert) {
    this.player.addOpponentPreviousGesture("rock");
    this.player.addOpponentPreviousGesture("rock");
    this.player.addOpponentPreviousGesture("rock");
    this.spy(this.player, "matchPattern");
    this.player.playTurn();
    assert.ok(this.player.matchPattern.returned(["rock"]));
});

QUnit.test("If the opponent played the same move for the first 6 turns, expect two prediction of the same move", function(assert) {
    this.player.addOpponentPreviousGesture("rock");
    this.player.addOpponentPreviousGesture("rock");
    this.player.addOpponentPreviousGesture("rock");
    this.player.addOpponentPreviousGesture("rock");
    this.player.addOpponentPreviousGesture("rock");
    this.player.addOpponentPreviousGesture("rock");
    this.spy(this.player, "matchPattern");
    this.player.playTurn();
    assert.ok(this.player.matchPattern.returned(["rock", "rock"]));
});

QUnit.test("If the opponent plays alternating moves, expect prediction of continuing pattern", function(assert) {
    this.player.addOpponentPreviousGesture("rock");
    this.player.addOpponentPreviousGesture("paper");
    this.player.addOpponentPreviousGesture("rock");
    this.spy(this.player, "matchPattern");
    this.player.playTurn();
    assert.ok(this.player.matchPattern.returned(["paper"]));
});

QUnit.test("If the opponent plays alternating moves, expect prediction of continuing pattern", function(assert) {
    this.player.addOpponentPreviousGesture("rock");
    this.player.addOpponentPreviousGesture("paper");
    this.player.addOpponentPreviousGesture("rock");
    this.player.addOpponentPreviousGesture("paper");
    this.player.addOpponentPreviousGesture("rock");
    this.player.addOpponentPreviousGesture("paper");
    this.spy(this.player, "matchPattern");
    this.player.playTurn();
    assert.ok(this.player.matchPattern.returned(["rock"]));
});

QUnit.test("If the opponent plays alternating moves, expect prediction of continuing pattern", function(assert) {
    this.player.addOpponentPreviousGesture("rock");
    this.player.addOpponentPreviousGesture("paper");
    this.player.addOpponentPreviousGesture("scissors");
    this.player.addOpponentPreviousGesture("rock");
    this.player.addOpponentPreviousGesture("paper");
    this.player.addOpponentPreviousGesture("scissors");
    this.spy(this.player, "matchPattern");
    this.player.playTurn();
    assert.ok(this.player.matchPattern.returned(["rock"]));
});

QUnit.test("In the array [\"rock\"], \"rock\" is the most frequent item", function(assert) {
    var mostFrequent = this.player.getMostFrequentItems(["rock"]);
    assert.deepEqual(mostFrequent, ["rock"], "In the array [\"rock\"], \"rock\" should be the most frequent item");
});

QUnit.test("In the array [\"rock\", \"rock\"], \"rock\" is the most frequent item", function(assert) {
    var mostFrequent = this.player.getMostFrequentItems(["rock", "rock"]);
    assert.deepEqual(mostFrequent, ["rock"], "In the array [\"rock\", \"rock\"], \"rock\" should be the most frequent item");
});

QUnit.test("In the array \"scissors\", [\"rock\", \"rock\"], \"rock\" is the most frequent item", function(assert) {
    var mostFrequent = this.player.getMostFrequentItems(["scissors", "rock", "rock"]);
    assert.deepEqual(mostFrequent, ["rock"], "In the array [\"scissors\", \"rock\", \"rock\"], \"rock\" should be the most frequent item");
});

QUnit.test("In the array [\"scissors\", \"rock\", \"rock\", \"scissors\"], \"rock\" and \"scissors\" are the most frequent items", function(assert) {
    var mostFrequent = this.player.getMostFrequentItems(["scissors", "rock", "rock", "scissors"]);
    assert.deepEqual(mostFrequent, ["scissors", "rock"], "In the array [\"scissors\", \"rock\", \"rock\", \"scissors\"], \"rock\" and \"scissors\" are the most frequent items");
});

QUnit.test("Paper beats rock", function(assert) {
    var beatingGesture = this.player.getBeatingGesture("rock");
   assert.deepEqual(beatingGesture, "paper", "Paper beats rock");
});