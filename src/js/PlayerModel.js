/**
 * Created by vickidunlop on 09/10/2014.
 */

function abstractMethod() {
    throw "This is an abstract method. Subclasses must provide their own definition";
}

function PlayerModel() {
    throw "You cannot instantiate abstract classes";
}

PlayerModel.prototype.playTurn = abstractMethod;

PlayerModel.prototype.getCurrentGesture = function() {
    return this.currentGesture;
};

PlayerModel.prototype.incrementScore = function() {
    ++this.score;
};

PlayerModel.prototype.getScore = function() {
    return this.score;
};
