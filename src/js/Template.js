/**
 * Created by vickidunlop on 13/10/2014.
 */

function Template(templateId, firstChildId) {
    this.templateElement = document.getElementById(templateId);
}

Template.prototype.setContent = function(contentId) {
    this.templateContent = document.getElementById(contentId);
};

Template.prototype.appendTo = function(elementId) {
    var element = document.getElementById(elementId);
    var clone = document.importNode(this.templateElement.content, true);
    element.appendChild(clone);
};

Template.prototype.removeFrom = function(elementId) {
    var element = document.getElementById(elementId);
    element.removeChild(document.getElementById(this.templateContent.id));
}
;
Template.prototype.getContentDimensions = function() {
    return {
        width: this.templateContent.offsetWidth,
        height: this.templateContent.offsetHeight
    };
};

Template.prototype.positionElement = function(position) {
    var positions = Object.keys(position);
    for(var i = 0; i < positions.length; i++) {
        this.templateContent.style[positions[i]] = position[positions[i]];
    }
};

Template.prototype.addEventListenersToElements = function(elementId, event, handler, callback) {
    var element = document.getElementById(elementId);
    for(var i = 0; i < element.length; i++) {
        this.addEventListenerToElement(element[i].id, event, handler, callback);
    }
};

Template.prototype.addEventListenerToElement = function(elementId, event, handler, callback) {
    var element = document.getElementById(elementId);
    element.addEventListener(event, function(e) {
        handler[callback](element);
        e.preventDefault();
        e.stopPropagation();
    }.bind(handler));
};

Template.prototype.disableElements = function(elementId) {
    var element = document.getElementById(elementId);
    for(var i = 0; i < element.length; i++) {
        element[i].disabled = true;
    }
};

Template.prototype.enableElements = function(elementId) {
    var element = document.getElementById(elementId);
    for(var i = 0; i < element.length; i++) {
        element[i].disabled = false;
    }
};