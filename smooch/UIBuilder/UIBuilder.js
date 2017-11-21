var FacebookUI = require('./Facebook');
var SmoochUI = require('./Smooch');
const FACEBOOK_CHANNEL = "facebook";

var UIBuilder = function (channelType) {
    var self = this;
    self.channelType = channelType;
};


UIBuilder.prototype.buildButtons = function (message, buttons) {

    var self = this;
    var payload;

    if (self.channelType == FACEBOOK_CHANNEL) {
        var fb = new FacebookUI();
        payload = fb.buildButtons(message, buttons);
    }
    else {
        var options = [];
        buttons.forEach(function (button) {
            options.push(button.title);
        });

        payload = {text: message, choices: options}
    }

    return payload;
};

UIBuilder.prototype.buildList = function (messages) {
    var self = this;
    var payload;

    if (self.channelType == FACEBOOK_CHANNEL) {
        var fb = new FacebookUI();
        payload = fb.buildList(messages)
    }
    else
    {
       payload = "LIST_NOT_SUPPORTED";
    }
    return payload;
};


module.exports = UIBuilder;