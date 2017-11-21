const bodyParser = require('body-parser');
const webhookUtil = require('../utils/webhookUtil');
const Smooch = require('smooch-core');
const SmoochUI = require('./UIBuilder/SmoochUI');
const HttpsProxyAgent = require('https-proxy-agent');


function init(router, config) {


    // general Preferences
    var metadata = {
        waitForMoreResponsesMs: 200,
        channelSecretKey: config.IB_WEBHOOK_SECRET,
        channelUrl: config.IB_WEBHOOK_URL
    };

    const KEY_ID = config.SMOOCH_KEY_ID; // Smooch Key ID
    const SECRET = config.SMOOCH_SECRET; // Smooch Secret

    const useProxy = config.USE_PROXY;
    var tempSmooch;

    // Configure Smooch Agent with Proxy
    if (useProxy) {
        const proxy = config.PROXY;
        console.log('using proxy server %j', proxy);
        const agent = new HttpsProxyAgent(proxy);

        tempSmooch = new Smooch({
            keyId: KEY_ID,
            secret: SECRET,
            scope: 'app'
        }, {
            httpAgent: agent
        });
    }
    // No Proxy
    else {
        tempSmooch = new Smooch({
            keyId: KEY_ID,
            secret: SECRET,
            scope: 'app'
        });
    }

    const smoochAgent = tempSmooch;


    console.log('Smooch Server is connected to IB Using Channel:', metadata.channelUrl);

    // Smooch uses JSON too!
    router.use(bodyParser.json());

    // IB RESPONSE - Outgoing Webhook URI
    router.post('/webhook/ib/messages', bodyParser.json(), function (req, res) {
        console.log("Message from webhook channel", req.body);

        const userID = req.body.userId;
        const smoochUI = new SmoochUI();
        if (!userID) {
            return res.status(400).send('Missing User ID');
        }
        if (webhookUtil.verifyMessageFromBot(req.get('X-Hub-Signature'), req.rawBody,req.encoding, metadata.channelSecretKey)) {
            res.sendStatus(200);
            console.log("Publishing to", userID);

            var ibPayload = req.body;
            var smoochPayload = smoochUI.transformFromIB(ibPayload);

            smoochAgent.appUsers.sendMessage(userID, smoochPayload)
                .then((response) => {
                    console.log('API RESPONSE:\n', response);
                    res.end();
                })
                .catch((err) => {
                    console.log('API ERROR:\n', err);
                    res.end();
                });
        } else {
            res.sendStatus(401);
            res.end();
        }
    });

    // Smooch incoming messages
    router.post('/webhook/smooch/messages', function (req, res) {

        const appUserId = req.body.appUser._id; // smooch userId

        let smoochMessagePayload;

        // pass any extra smooch properties to IB
        let extraProfileProperties = req.body.appUser.properties;

        extraProfileProperties.webhookChannel = 'smooch'; // Let IB CC know that this is smooch specific webhook

        // Smooch Text Message
        if (req.body.trigger === 'message:appUser') {
            var smoochMessages = req.body.messages;
            smoochMessages.forEach(function(smoochMessage){
               if(smoochMessage.type === 'location')
               {
                   smoochMessagePayload = smoochMessage.coordinates;
               }
               else
               {
                   smoochMessagePayload = smoochMessage.text;
               }
            });

        }
        // Smooch Postback Button
        else if (req.body.trigger === 'postback') {
            smoochMessagePayload = req.body.postbacks[0].action.payload;
        }
        // Getting started Button (converstion start)
        else if( req.body.trigger == "conversation:start")
        {
            command = "Getting Started";
        }
        // Any other command
        else {
            res.sendStatus(200);
            res.end();
        }


        res.sendStatus(200);

        // set the message to the bot!
        webhookUtil.messageToBot(metadata.channelUrl, metadata.channelSecretKey, appUserId, smoochMessagePayload, extraProfileProperties, function (err) {
            if (err) {
                console.log("Failed sending message to Bot");

                smoochAgent.appUsers.sendMessage(appUserId, {
                    type: 'text',
                    text: 'Failed sending message to Bot.  Please review your bot configuration.',
                    role: 'appMaker'
                })
                    .then((response) => {
                        console.log('API RESPONSE:\n', response);
                        res.end();
                    })
                    .catch((err) => {
                        console.log('API ERROR:\n', err);
                        res.end();
                    });
            }
            else {
                console.log('*** Message has been send to the bot!!! ***')
            }
        });
    });

    // smooch web client
    router.get('/webhook/smoochclient', function (req, res) {
        console.log("getting smooch client file");
        res.sendFile('smooch-client.html', {root: __dirname});
    });

}

module.exports = {
    init: init
};
