/**
 * Created by vickidunlop on 13/10/2014.
 */

function ViewScaler() {

}

ViewScaler.prototype.init = function() {
    this.MAX_WIDTH = 800;
    this.MIN_WIDTH = 480;
    this.MAX_HEIGHT = 600;
    this.MIN_HEIGHT = 360;
    this.scaleFactor = 1;
    
    var width = this.MAX_WIDTH;
    var height = this.MAX_HEIGHT;
    var screenWidth =  Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    if(screenWidth < this.MAX_WIDTH ) {
        if(screenWidth < this.MIN_WIDTH) {
            width = this.MIN_WIDTH;
        } else {
            width = screenWidth;
        }
    }
    if(screenHeight < this.MAX_HEIGHT) {
        if(screenHeight < this.MIN_HEIGHT) {
            height = this.MIN_HEIGHT;
        } else {
            height = screenHeight;
        }
    }
    if(height/0.75 < width) {
        this.scaleFactor = height/this.MAX_HEIGHT;
    } else {
        this.scaleFactor = width/this.MAX_WIDTH ;
    }

    // Scale page elements
    var wrapper = document.getElementById("wrapper");
    var container = document.getElementById("rockPaperScissors");
    var canvas = document.getElementById("canvas");

    wrapper.style.width = width + "px";
    container.style.width = width + "px";
    container.style.height = height + "px";
    canvas.width = width;
    canvas.height = height;
};

ViewScaler.prototype.scale = function(number) {
    return number*this.scaleFactor;
};

ViewScaler.prototype.drawImage = function(context, image, x, y, width, height) {
    context.drawImage(image, x*this.scaleFactor, y*this.scaleFactor, width*this.scaleFactor, height*this.scaleFactor);
};

ViewScaler.prototype.fillText = function(context, text, x, y) {
    context.fillText(text, x*this.scaleFactor, y*this.scaleFactor);
};

ViewScaler.prototype.strokeText = function(context, text, x, y) {
    context.strokeText(text, x*this.scaleFactor, y*this.scaleFactor);
};

ViewScaler.prototype.rect = function(context, x, y, width, height) {
    context.rect(x*this.scaleFactor, y*this.scaleFactor, width*this.scaleFactor, height*this.scaleFactor);
};