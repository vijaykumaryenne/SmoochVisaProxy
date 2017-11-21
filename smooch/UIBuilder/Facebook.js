var Facebook = function () {
    "use strict";
};

Facebook.prototype.buildButtons = function (message, buttons) {
    var text = message;
    var fbButtons = [];
    var fbPayload = {};

    // Normal Buttons - FB Buttons Template
    if (buttons.length > 0 && buttons.length <= 3) {
        buttons.forEach(function (button) {
            fbButtons.push({type: "postback", title: button.title, payload: button.payload});

        });

        fbPayload = {
            attachment: {
                type: 'template',
                payload: {template_type: 'button', text: text, buttons: fbButtons}
            }
        };

    }
    // Quick replies
    else if (buttons.length > 3 && buttons.length <= 11) {
        buttons.forEach(function (button) {
            fbButtons.push({content_type: "text", title: button.title, payload: button.payload});

        });

        fbPayload = {text: text, quick_replies: fbButtons};


    }

    return fbPayload;
};

Facebook.prototype.buildList = function (messages) {

    var fbElements = [];

    messages.slice(0, 9).forEach(function (message) {

        var buttons = [];

        // build Buttons
        message.buttons.forEach(function (button) {
            buttons.push({type: 'postback', title: button.title, payload: button.payload});
        });

       // if Subtitle exists
        if(message.summary)
        {
            fbElements.push({
                title: message.title,
                subtitle: message.summary.substr(0, 76).concat('...') ,
                buttons: buttons
            });
        }
        else
        {
            fbElements.push({
                title: message.title,
                buttons: buttons
            });
        }


    });

    var payload = {
        attachment: {
            type: 'template',
            payload: {template_type: 'generic', elements: fbElements}
        }
    };

    return payload;
};

module.exports = Facebook;
