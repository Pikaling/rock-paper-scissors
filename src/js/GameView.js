/**
 * Created by vickidunlop on 10/10/2014.
 */

function GameView() {
    this.viewScaler = new ViewScaler();
    this.hasHumanPlayer = false;
    this.states = [];
    this.currentState = 0;
    this.player1Score = 0;
    this.player2Score = 0;
    this.winningMessage = " is the winner!";
    this.gameOver = false;
}

/*
 * Initialisation
 */

GameView.prototype.setController = function(controller) {
    this.controller = controller;
};

GameView.prototype.setHasHumanPlayer = function(hasHumanPlayer) {
    this.hasHumanPlayer = hasHumanPlayer;
};

GameView.prototype.init = function() {
    this.viewScaler.init();
    var canvas = document.getElementById("canvas");
    this.context = canvas.getContext("2d");
    this.audio = document.getElementById("gameSound");
    this.source = document.getElementById("soundEffect");
    var toggleMuteButton = document.getElementById("toggleMuteButton");
    toggleMuteButton.addEventListener("click", this.toggleMute(), false);
    this.loadImages();
};

GameView.prototype.loadImages = function() {
    this.images = {};
    this.loadedImages = 0;
    this.sources = {
        background: "../img/playground.gif",
        human1: "../img/player1.gif",
        computer1: "../img/computer1.gif",
        computer2: "../img/computer2.gif",
        rock: "../img/rock.gif",
        paper: "../img/paper.gif",
        scissors: "../img/scissors.gif",
        rockPaperScissors: "../img/rock-paper-scissors.gif"
    };
    this.imageKeys = Object.keys(this.sources);
    for(var i = 0; i < this.imageKeys.length; i++) {
        this.images[this.imageKeys[i]] = new Image();
        this.images[this.imageKeys[i]].onload = this.loadImage();
        this.images[this.imageKeys[i]].src = this.sources[this.imageKeys[i]];
    }
};

GameView.prototype.loadImage = function() {
    return function() {
        if(++this.loadedImages >= this.imageKeys.length) {
            this.drawStartScreen();
        }
    }.bind(this);
};

/*
 * Game stages
 */

GameView.prototype.startGame = function() {
    this.newGameFormTemplate.removeFrom("rockPaperScissors");
    if(this.hasHumanPlayer) {
        this.addGameControls();
    }
    this.drawBackground();
};

GameView.prototype.update = function(modelState) {
    // Store a copy of the state
    var state = JSON.parse(JSON.stringify(modelState));
    this.states.push(state);

    // If there is a human player, update the view immediately.
    if(this.hasHumanPlayer || (this.states.length -1 === this.currentState)) {
        if(this.hasHumanPlayer) {
            this.currentState = this.states.length - 1;
        }
        this.drawState();
    }
    // If there is not a human player and we are on the initial state, progress to the next state (first move of the game).
    if(!this.hasHumanPlayer && this.states.length === 1 && this.currentState === 0) {
        setTimeout(function() {
            this.currentState++;
            this.drawState();
        }.bind(this), 1000);
    }
};

GameView.prototype.endGame = function(winner) {
    this.winningMessage = winner + this.winningMessage;
    this.gameOver = true;
};

/*
 * Template manipulation
 */

GameView.prototype.addNewGameForm = function() {
    this.newGameFormTemplate = new Template("newGameFormTemplate");
    this.newGameFormTemplate.appendTo("rockPaperScissors");
    this.newGameFormTemplate.setContent("newGame");
    var newGameDimensions = this.newGameFormTemplate.getContentDimensions();
    this.newGameFormTemplate.positionElement({
        bottom:  (this.viewScaler.scale(this.viewScaler.MAX_HEIGHT - 275) - newGameDimensions.height) / 2 + "px",
        left: ((this.viewScaler.scale(this.viewScaler.MAX_WIDTH) - newGameDimensions.width) / 2) + "px"
    });
    this.newGameFormTemplate.addEventListenerToElement("newGameForm", "submit", this.controller, "startGame");
};

GameView.prototype.addGameControls = function() {
    this.gameControlsTemplate = new Template("gameControlsTemplate");
    this.gameControlsTemplate.appendTo("rockPaperScissors");
    this.gameControlsTemplate.setContent("gameControlsForm");
    this.gameControlsTemplate.positionElement({
        bottom:  (this.viewScaler.scale(10)) + "px",
        left: (this.viewScaler.scale(275)) + "px"
    });
    this.gameControlsTemplate.addEventListenersToElements("gameControlsForm", "click", this.controller, "processPlayerInput");
};

GameView.prototype.disablePlayerInput = function() {
    this.gameControlsTemplate.disableElements("gameControlsForm");
};

GameView.prototype.enablePlayerInput = function() {
    this.gameControlsTemplate.enableElements("gameControlsForm");
};

GameView.prototype.addResetGameForm = function() {
    this.gameControlsTemplate.removeFrom("rockPaperScissors");
    this.resetGameTemplate = new Template("resetGameTemplate");
    this.resetGameTemplate.appendTo("rockPaperScissors");
    this.resetGameTemplate.setContent("resetGameForm");
    var resetGameContentDimensions = this.resetGameTemplate.getContentDimensions();
    this.resetGameTemplate.positionElement({
        bottom: (this.viewScaler.scale(100)) + "px",
        left: ((this.viewScaler.scale(this.viewScaler.MAX_WIDTH) - resetGameContentDimensions.width) / 2) + "px"
    });
    this.resetGameTemplate.addEventListenerToElement("resetGame", "submit", this, "drawStartScreen");
};

/*
 * DOM manipulation
 */

GameView.prototype.toggleMute = function() {
    return function() {
        this.audio.muted = !this.audio.muted;
        // Get the image in the button
        var buttonImg = document.getElementById("toggleMuteButton").firstElementChild;

        // Temporarily store its attributes
        var currentTitle = buttonImg.getAttribute("title");
        var currentAltText = buttonImg.getAttribute("alt");
        var currentSrc = buttonImg.getAttribute("src");

        // Update its attributes using its data attributes
        buttonImg.setAttribute("title", buttonImg.dataset.title);
        buttonImg.setAttribute("alt", buttonImg.dataset.alt);
        buttonImg.setAttribute("src", buttonImg.dataset.src);

        // Store the original attributes in the data attributes
        buttonImg.dataset.title = currentTitle;
        buttonImg.dataset.alt = currentAltText;
        buttonImg.dataset.src = currentSrc;
    }.bind(this);
};

GameView.prototype.displayErrorMessage = function(message) {
    var bestOfError = document.getElementById("bestOfError");
    bestOfError.innerText = message;
    bestOfError.style.display = "block";
};

/*
 * Canvas drawing
 */

GameView.prototype.drawStartScreen = function() {
    this.drawBackground();
    this.context.fillStyle = "rgba(0, 0, 0, 0.3)";
    this.viewScaler.rect(this.context, 0, 0, this.viewScaler.MAX_WIDTH, this.viewScaler.MAX_HEIGHT);
    this.context.fill();
    this.viewScaler.drawImage(this.context, this.images.rockPaperScissors, 50, 50, 700, 225);
    this.addNewGameForm();
};

GameView.prototype.drawBackground = function() {
    this.viewScaler.drawImage(this.context, this.images.background, 0, 0, this.viewScaler.MAX_WIDTH, this.viewScaler.MAX_HEIGHT);
    if(this.hasHumanPlayer) {
        this.viewScaler.drawImage(this.context, this.images.human1, 50, 200, 200, 397);
    } else {
        this.viewScaler.drawImage(this.context, this.images.computer1, 50, 200, 200, 397);
    }
    this.viewScaler.drawImage(this.context, this.images.computer2, 550, 200, 200, 397);
    if(this.states.length) {
        this.context.fillStyle = "black";
        var fontSize = this.viewScaler.scale(48);
        this.context.font = fontSize + "px Arial";
        this.context.textAlign="center";
        this.viewScaler.fillText(this.context, "Best of "+this.states[0].bestOf, 400, 60);
    }
    this.drawScores();
};

GameView.prototype.drawScores = function() {
    this.context.fillStyle = "#C4DEF8";
    this.context.beginPath();
    this.viewScaler.rect(this.context, 50, 105, 210, 30);
    this.context.fill();
    this.context.beginPath();
    this.viewScaler.rect(this.context, 550, 105, 210, 30);
    this.context.fill();
    this.context.fillStyle = "black";
    var fontSize = this.viewScaler.scale(24);
    this.context.font = fontSize + "px Arial";
    this.context.textAlign="left";
    this.viewScaler.fillText(this.context, "Player 1 score: " + this.player1Score, 50, 130);
    this.context.textAlign="right";
    this.viewScaler.fillText(this.context, "Player 2 score: " + this.player2Score, 750, 130);
};


GameView.prototype.drawState = function() {
    if(this.currentState > 0) {
        this.source.src="../sound/countdown.wav";
        this.audio.load();
        this.audio.play();
        this.countDown(3);
    } else {
        this.drawBackground();
    }
};

GameView.prototype.countDown = function(number) {
    this.drawBackground();
    if(number > 0) {
        this.context.fillStyle = "black";
        var fontSize = this.viewScaler.scale(48);
        this.context.font = fontSize + "px Arial";
        this.context.textAlign="center";
        this.viewScaler.fillText(this.context, number, 400, 340);
        setTimeout(function() {
            this.countDown(--number);
        }.bind(this), 1000);
    } else {
        this.drawGestures(0, 0);
    }
};

GameView.prototype.drawGestures = function(startingWidth, startingHeight) {
    var imageX = ((100 - startingWidth) / 2);
    var imageY = ((163 - startingHeight) / 2);
    this.drawBackground();
    this.viewScaler.drawImage(this.context, this.images[this.states[this.currentState].player1.currentGesture], imageX+275, imageY+250, startingWidth, startingHeight);
    this.viewScaler.drawImage(this.context, this.images[this.states[this.currentState].player2.currentGesture], imageX+425, imageY+250, startingWidth, startingHeight);
    if(startingWidth < 100 && startingHeight < 163) {
        startingWidth += 100/60;
        startingHeight += 163/60;
        requestAnimationFrame(function() {
            this.drawGestures(startingWidth, startingHeight);
        }.bind(this));
    } else {
        this.drawOutcome();
    }
};

GameView.prototype.drawOutcome = function() {
    this.source.src="../sound/MAGIC.WAV";
    this.audio.load();
    this.audio.play();
    this.drawOutcomeText(this.states[this.currentState].turnOutcome);
    this.player1Score = this.states[this.currentState].player1.score;
    this.player2Score = this.states[this.currentState].player2.score;
    this.drawScores();
    if(!this.hasHumanPlayer) {
        setTimeout(function() {
            if(++this.currentState < this.states.length) {
                this.drawState();
            } else {
                this.drawWinningMessage();
            }
        }.bind(this), 2000);
    } else {
        if(this.gameOver) {
            setTimeout(function() {
                this.drawWinningMessage();
            }.bind(this), 2000);
        } else {
            this.enablePlayerInput();
        }
    }
};

GameView.prototype.drawOutcomeText = function(text) {
    this.context.fillStyle = "white";
    this.context.strokeStyle = "black";
    var fontSize = this.viewScaler.scale(40);
    this.context.font =  "bold " + fontSize + "px Arial";
    this.context.textAlign="center";
    this.viewScaler.fillText(this.context, text, 400, 340);
    this.viewScaler.strokeText(this.context, text, 400, 340);
};

GameView.prototype.drawWinningMessage = function() {
    this.source.src="../sound/BONUS7.WAV";
    this.audio.load();
    this.audio.play();
    this.drawBackground();
    this.drawOutcomeText(this.winningMessage);
    this.addResetGameForm();
};