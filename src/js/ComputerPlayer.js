/**
 * Created by vickidunlop on 13/10/2014.
 */

function ComputerPlayer(game) {
    this.model = game;
    this.gestures = this.model.getGestures();
    this.currentGesture = "";
    this.score = 0;
    this.opponentGestureHistory = [];
    this.maxPatternLength = 4;
}

ComputerPlayer.prototype = Object.create(PlayerModel.prototype);
ComputerPlayer.prototype.constructor = ComputerPlayer;

ComputerPlayer.prototype.playTurn = function() {
    var gesture;
    // Once the opponent has played at least 2 moves, we can try to predict their next move
    if(this.opponentGestureHistory.length > 1) {
        var patternLength = this.getPatternLength(), needle, opponentMovePredictions, bestPredictions;
        do {
            needle = this.opponentGestureHistory.slice(-patternLength);
            opponentMovePredictions = this.matchPattern(needle, this.opponentGestureHistory);
            if(opponentMovePredictions.length) {
                bestPredictions = this.getMostFrequentItems(opponentMovePredictions);
            }
            patternLength--;
        } while(patternLength > 0 && !bestPredictions);
        // If they haven't played this pattern of moves before, then pick a gesture based on their most frequent plays
        if(!bestPredictions) {
            bestPredictions = this.getMostFrequentItems(this.opponentGestureHistory);
        }
        if(bestPredictions.length > 1) {
            gesture = bestPredictions[Math.floor(Math.random() * bestPredictions.length)];
        } else {
            gesture = this.getBeatingGesture(bestPredictions[0]);
        }
        this.currentGesture = gesture;
    } else {
        // Fallback strategy for early game - pick at random
        var keys = Object.keys(this.gestures);
        gesture = Math.floor(Math.random() * keys.length);
        this.currentGesture = keys[gesture];
    }
};

ComputerPlayer.prototype.addOpponentPreviousGesture = function(gesture) {
    this.opponentGestureHistory.push(gesture);
};

ComputerPlayer.prototype.getPatternLength = function() {
    return this.maxPatternLength > this.opponentGestureHistory.length-1 ? this.opponentGestureHistory.length-1 : this.maxPatternLength;
};

ComputerPlayer.prototype.matchPattern = function(needle, haystack) {
    var movePredictions = [];
    var matchedPattern = false;
    for(var i = haystack.length - 1; i >= 0 ; i--) {
        for(var j = needle.length - 1; j >= 0; j--) {
            matchedPattern = haystack[i - ((needle.length -1) - j)] === needle[j];
            if(!matchedPattern) {
                break;
            }
        }
        if(matchedPattern && i+1 < haystack.length) {
            movePredictions.push(haystack[i+1]);
        }
    }
    return movePredictions;
};

ComputerPlayer.prototype.getMostFrequentItems = function(array) {
    var frequencies = {}, keys, highestFrequency = 0, mostFrequentItems = [];
    for(var i = 0; i < array.length; i++) {
        if(frequencies.hasOwnProperty(array[i])) {
            frequencies[array[i]]++;
        } else {
            frequencies[array[i]] = 1;
        }
    }
    keys = Object.keys(frequencies);
    for(var j = 0; j < keys.length; j++) {
        if(frequencies[keys[j]] > highestFrequency) {
            highestFrequency = frequencies[keys[j]];
            mostFrequentItems = [keys[j]];
        } else if(frequencies[keys[j]] === highestFrequency) {
            mostFrequentItems.push(keys[j]);
        }
    }
    return mostFrequentItems;
};

ComputerPlayer.prototype.getBeatingGesture = function(gesture) {
    var keys = Object.keys(this.gestures);
    for(var i = 0; i < keys.length; i++) {
        if(this.gestures[keys[i]].beats === gesture) {
            return keys[i];
        }
    }
};