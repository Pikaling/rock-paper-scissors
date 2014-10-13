/**
 * Created by vickidunlop on 10/10/2014.
 */

function GameController(model, view) {
    this.model = model;
    this.view = view;
}

GameController.prototype.startGame = function() {
    var bestOf = document.getElementById("bestOf").value;
    var radios = document.getElementsByName("playerType");
    var playerType, hasHumanPlayer;
    for(var i = 0; i < radios.length; i++) {
        if(radios[i].checked) {
            playerType = radios[i].value;
        }
    }
    hasHumanPlayer = (playerType === "human");
    try {
        this.view.setHasHumanPlayer(hasHumanPlayer);
        this.model.init(bestOf, hasHumanPlayer);
        this.view.startGame();
        if(!hasHumanPlayer) {
            this.model.play();
        }
    } catch(error) {
        this.view.displayErrorMessage(error);
    }
};

GameController.prototype.processPlayerInput = function(button) {
    this.model.playTurn(button.value);
    this.view.disablePlayerInput();
};