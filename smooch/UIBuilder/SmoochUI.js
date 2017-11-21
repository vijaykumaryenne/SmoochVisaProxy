var SmoochUI = function () {
    var self = this;
    self.smoochPayload = {role: 'appMaker'};
};

SmoochUI.prototype.transformFromIB = function(ibPayload)
{
    var self = this;

    // if IB CC generated smooch specific UI, it should contain the the 'type' property, so if it exists, no need for transformation and return it as is.
    // This is a workaround till a more robust mechanism to be implemented.
    if(ibPayload.hasOwnProperty('type'))
    {
        return ibPayload;
    }

    // Text Messages
    if(ibPayload.hasOwnProperty('text'))
    {
        self.smoochPayload.text = ibPayload.text;
        self.smoochPayload.type = 'text';

       // List Buttons
        if(ibPayload.hasOwnProperty('choices') && ibPayload.choices.length >0)
        {
            var ibActions = ibPayload.choices;
            var smoochActions = [];

            var useSmoochQuickReplies = ibActions.length > 3 ? true : false;

            ibActions.forEach((function (ibAction) {
                smoochActions.push({text:ibAction , payload:ibAction , type : (useSmoochQuickReplies ? 'reply' : 'postback') })
            }));

            self.smoochPayload.actions = smoochActions;
        }
        // Quick Reply Buttons
        else if(ibPayload.hasOwnProperty('actions'))
        {
            self.smoochPayload.actions = ibPayload.actions;
        }
    }

    return self.smoochPayload;
};

SmoochUI.prototype.buildButtons = function (message, buttons) {
    var self = this;
    var text = message;
    var smoochButtons = [];

    buttons.forEach(function (button) {

        var smoochButton = {type: button.type, text: button.title, payload: button.payload};

        if (button.type === 'reply' && button.hasOwnProperty('iconUrl')) {
            smoochButton.iconUrl = button.iconUrl
        }
        else if (button.type === 'link' && button.hasOwnProperty('uri')) {
            smoochButton.uri = button.uri;
        }
        smoochButtons.push(smoochButton);

    });

    self.smoochPayload = {
        text: text,
        actions: smoochButtons
    };

    return self.smoochPayload;
};


SmoochUI.prototype.buildList = function (messages) {
    var self = this;

    var smoochElements = [];

    messages.slice(0, 9).forEach(function (message) {

        var smoochElement = {};

        // build Buttons
        var smoochButtons = [];
        message.buttons.forEach(function (button) {
            smoochButtons.push({type: button.type, text: button.title, payload: button.payload});
        });

        smoochElement.title = message.title;
        smoochElement.actions = smoochButtons;
        // if Subtitle exists
        if (message.hasOwnProperty('summary')) {
            smoochElement.description = message.summary.substr(0, 76).concat('...');
        }
        // if Image exists
        if (message.hasOwnProperty('imageUrl')) {
            smoochElement.mediaUrl = message.imageUrl;
        }

        smoochElements.push(smoochElement);
    });

    self.smoochPayload.type = 'carousel';
    self.smoochPayload.items = smoochElements;

    return self.smoochPayload;
};

module.exports = SmoochUI;
