/**
 * Created by vickidunlop on 09/10/2014.
 */

function GameModel() {
    this.gestures = {
        rock: {
            beats: "scissors"
        },
        paper: {
            beats: "rock"
        },
        scissors: {
            beats: "paper"
        }
    };
    this.scoreNeeded = 0;
    this.hasHumanPlayer = false;
}

GameModel.prototype.setView = function(view) {
    this.view = view;
};

GameModel.prototype.init = function(bestOf, hasHumanPlayer) {
    this.hasHumanPlayer = hasHumanPlayer;
    if(bestOf % 2 === 1) {
        this.calculateScoreNeeded(bestOf);
    }
    else {
        throw "'Best of' must be an odd number";
    }
    this.createPlayers();
    this.initState(bestOf);
    this.view.update(this.state);
};

GameModel.prototype.calculateScoreNeeded = function(bestOf) {
    this.scoreNeeded = Math.ceil(bestOf / 2);
};

GameModel.prototype.createPlayers = function() {
    if(this.hasHumanPlayer) {
        this.player1 = new HumanPlayer(this);
    } else {
        this.player1 = new ComputerPlayer(this);
    }
    this.player2 = new ComputerPlayer(this);
};

GameModel.prototype.initState = function(bestOf) {
    this.state = {
        "player1": {
            "currentGesture": this.player1.getCurrentGesture(),
            "score": this.player1.getScore()
        },
        "player2": {
            "currentGesture": this.player2.getCurrentGesture(),
            "score": this.player2.getScore()
        },
        "turnOutcome": "",
        "bestOf": bestOf
    };
};

GameModel.prototype.updateState = function(turnOutcome) {
    this.state.player1.currentGesture = this.player1.getCurrentGesture();
    this.state.player1.score = this.player1.getScore();
    this.state.player2.currentGesture = this.player2.getCurrentGesture();
    this.state.player2.score = this.player2.getScore();
    this.state.turnOutcome = turnOutcome;
};

GameModel.prototype.getGestures = function() {
    return this.gestures;
};

GameModel.prototype.getPlayer1 = function() {
    return this.player1;
};

GameModel.prototype.getPlayer2 = function() {
    return this.player2;
};

GameModel.prototype.getNumWinsNeeded = function() {
    return this.scoreNeeded;
};

GameModel.prototype.compareGestures = function(gesture1, gesture2) {
    if(this.gestures.hasOwnProperty(gesture1) && this.gestures.hasOwnProperty(gesture2)) {
        if (this.gestures[gesture2].beats === gesture1) {
            return -1;
        }
        if (this.gestures[gesture1].beats === gesture2) {
            return 1;
        }
    }
    return 0;
};

GameModel.prototype.playTurn = function(gesture) {
    this.player1.playTurn(gesture);
    this.player2.playTurn();
    var turnOutcome = this.scoreTurn();
    this.updateState(turnOutcome);
    this.view.update(this.state);
    this.player2.addOpponentPreviousGesture(this.player1.getCurrentGesture());
    if(this.hasHumanPlayer) {
        this.checkForWinner();
    } else {
        this.player1.addOpponentPreviousGesture(this.player2.getCurrentGesture());
    }
};

GameModel.prototype.scoreTurn = function() {
    var message = "";
    var gesture1 = this.player1.getCurrentGesture();
    var gesture2 = this.player2.getCurrentGesture();
    var outcome = this.compareGestures(gesture1, gesture2);
    switch(outcome) {
        case 1:
            this.player1.incrementScore();
            if(this.hasHumanPlayer){
                message = "You win!";
            } else {
                message = "Player 1 wins!";
            }
            break;
        case -1:
            this.player2.incrementScore();
            if(this.hasHumanPlayer){
                message = "You lose!";
            } else {
                message = "Player 2 wins!";
            }
            break;
        default:
            message = "It's a draw!";
    }
    return message;
};

GameModel.prototype.checkForWinner = function() {
    if(this.player1.getScore() === this.scoreNeeded) {
        this.view.endGame("Player 1");
    }
    if(this.player2.getScore() === this.scoreNeeded) {
        this.view.endGame("Player 2");
    }
};

GameModel.prototype.play = function() {
    while((this.player1.getScore() < this.scoreNeeded) &&
          (this.player2.getScore() < this.scoreNeeded)) {
        this.playTurn();
    }
    this.checkForWinner();
};