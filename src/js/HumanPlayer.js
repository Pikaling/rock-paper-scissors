/**
 * Created by vickidunlop on 11/10/2014.
 */

function HumanPlayer(game) {
    this.model = game;
    this.gestures = this.model.getGestures();
    this.currentGesture = "";
    this.score = 0;
}

HumanPlayer.prototype = Object.create(PlayerModel.prototype);
HumanPlayer.prototype.constructor = HumanPlayer;

HumanPlayer.prototype.playTurn = function(gesture) {
    this.currentGesture = gesture;
};
