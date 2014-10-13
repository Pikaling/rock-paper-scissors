/**
 * Created by vickidunlop on 09/10/2014.
 */

/**
 * Created by vickidunlop on 09/10/2014.
 */

QUnit.module("Gestures", {
    setup: function() {
        this.model = new GameModel();
    }
});

QUnit.test("Rock beats scissors", function(assert) {
    var outcome = this.model.compareGestures("rock", "scissors");
    assert.deepEqual(outcome, 1, "Rock should beat scissors");
});

QUnit.test("Paper beats rock", function(assert) {
    var outcome = this.model.compareGestures("paper", "rock");
    assert.deepEqual(outcome, 1, "Paper should beat rock");
});

QUnit.test("Scissors beat paper", function(assert) {
    var outcome = this.model.compareGestures("scissors", "paper");
    assert.deepEqual(outcome, 1, "Scissors should beat paper");
});

QUnit.test("Rock loses to paper", function(assert) {
    var outcome = this.model.compareGestures("rock", "paper");
    assert.deepEqual(outcome, -1, "Rock should lose to paper");
});

QUnit.test("Paper loses to scissors", function(assert) {
    var outcome = this.model.compareGestures("paper", "scissors");
    assert.deepEqual(outcome, -1, "Paper should lose to scissors");
});

QUnit.test("Scissors loses to rock", function(assert) {
    var outcome = this.model.compareGestures("scissors", "rock");
    assert.deepEqual(outcome, -1, "Scissors should lose to rock");
});

QUnit.test("Rock draws with rock", function(assert) {
    var outcome = this.model.compareGestures("rock", "rock");
    assert.deepEqual(outcome, 0, "Rock should draw with rock");
});

QUnit.test("Paper draws with paper", function(assert) {
    var outcome = this.model.compareGestures("paper", "paper");
    assert.deepEqual(outcome, 0, "Paper should draw with paper");
});

QUnit.test("Scissors draws with scissors", function(assert) {
    var outcome = this.model.compareGestures("scissors", "scissors");
    assert.deepEqual(outcome, 0, "Scissors should draw with scissors");
});


QUnit.module("Playing turns", {
    setup: function() {

    }
});

QUnit.test("On a turn, each player plays", function(assert) {
    var model = new GameModel();
    var view = new GameView();
    this.stub(view, "update");
    model.setView(view);
    model.init(1);
    var player1 = model.getPlayer1();
    var player2 = model.getPlayer2();
    this.spy(player1, "playTurn");
    this.spy(player2, "playTurn");
    model.playTurn();
    assert.ok(player1.playTurn.calledOnce);
    assert.ok(player2.playTurn.calledOnce);
});

QUnit.test("If player 1 wins the turn, they get a point", function(assert) {
    var model = new GameModel();
    var view = new GameView();
    this.stub(view, "update");
    model.setView(view);
    model.init(1);
    var player1 = model.getPlayer1();
    var player2 = model.getPlayer2();
    var stubPlayer1GetCurrentGesture = this.stub(player1, "getCurrentGesture");
    var stubPlayer2GetCurrentGesture = this.stub(player2, "getCurrentGesture");
    stubPlayer1GetCurrentGesture.returns("rock");
    stubPlayer2GetCurrentGesture.returns("scissors");
    model.playTurn();
    assert.deepEqual(player1.getScore(), 1);
    assert.deepEqual(player2.getScore(), 0);
});

QUnit.test("If player 2 wins the turn, they get a point", function(assert) {
    var model = new GameModel();
    var view = new GameView();
    this.stub(view, "update");
    model.setView(view);
    model.init(1);
    var player1 = model.getPlayer1();
    var player2 = model.getPlayer2();
    var stubPlayer1GetCurrentGesture = this.stub(player1, "getCurrentGesture");
    var stubPlayer2GetCurrentGesture = this.stub(player2, "getCurrentGesture");
    stubPlayer1GetCurrentGesture.returns("rock");
    stubPlayer2GetCurrentGesture.returns("paper");
    model.playTurn();
    assert.deepEqual(player1.getScore(), 0);
    assert.deepEqual(player2.getScore(), 1);
});

QUnit.test("If both players play the same gesture, no one gets a point", function(assert) {
    var model = new GameModel();
    var view = new GameView();
    this.stub(view, "update");
    model.setView(view);
    model.init(1);
    var player1 = model.getPlayer1();
    var player2 = model.getPlayer2();
    var stubPlayer1GetCurrentGesture = this.stub(player1, "getCurrentGesture");
    var stubPlayer2GetCurrentGesture = this.stub(player2, "getCurrentGesture");
    stubPlayer1GetCurrentGesture.returns("rock");
    stubPlayer2GetCurrentGesture.returns("rock");
    model.playTurn();
    assert.deepEqual(player1.getScore(), 0);
    assert.deepEqual(player2.getScore(), 0);
});


QUnit.module("Playing games", {
});

QUnit.test("If a 'best of 1' game is created, a player needs to win 1 round to win the game", function(assert) {
    var model = new GameModel();
    var view = new GameView();
    this.stub(view, "update");
    model.setView(view);
    model.init(1);
    var numWinsNeeded = model.getNumWinsNeeded();
    assert.deepEqual(numWinsNeeded, 1, "In a 'best of 1' game, 1 win is enough to win the game");
});

QUnit.test("If a 'best of 3' game is created, a player needs to win 2 rounds to win the game", function(assert) {
    var model = new GameModel();
    var view = new GameView();
    this.stub(view, "update");
    model.setView(view);
    model.init(3);
    var numWinsNeeded = model.getNumWinsNeeded();
    assert.deepEqual(numWinsNeeded, 2, "In a 'best of 3' game, 2 score is enough to win the game");
});

QUnit.test("If a 'best of 11' game is created, a player needs to win 6 rounds to win the game", function(assert) {
    var model = new GameModel();
    var view = new GameView();
    this.stub(view, "update");
    model.setView(view);
    model.init(11);
    var numWinsNeeded = model.getNumWinsNeeded();
    assert.deepEqual(numWinsNeeded, 6, "In a 'best of 11' game, 6 score is enough to win the game");
});

QUnit.test("If I try to start a 'best of 2' game, an error is thrown", function(assert) {
    assert.throws(
        function() {
            this.model.init(2);
        },
        "Creating a 'best of 2' game throws an error"
    );
});