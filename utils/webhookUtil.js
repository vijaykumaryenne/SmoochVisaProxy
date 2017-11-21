const crypto = require('crypto');
const request = require('request');

function verifyMessageFromBot(signature, msgBody, encoding,secretKey) {
    if (!signature) {
        console.log('Missing signature');
        return false;
    }
    const body = Buffer.from(JSON.stringify(msgBody), encoding);
    const calculatedSig = buildSignatureHeader(msgBody, secretKey);
    if (signature !== calculatedSig) {
        console.log('Invalid signature:', signature);
        console.log('Body: \n"%s"', msgBody);
        console.log('Calculated sig: %s', calculatedSig);
        return false;
    }
    console.log('Valid signature: %s', signature);
    return true;
}

/*
 'buf' is a Buffer
 'secret' is a String
 */
function buildSignatureHeader(buf, secret) {
    return 'sha256=' + buildSignature(buf, secret);
}

function buildSignature(buf, secret) {
    const hmac = crypto.createHmac('sha256', Buffer.from(secret, 'utf8'));
    hmac.update(buf);
    return hmac.digest('hex');
}

function messageToBot(channelUrl, channelSecretKey, userId, inMsg, userProfileAttributes , callback) {
    const outMsg = {
        userId: userId,
        text: inMsg
    };

    if(userProfileAttributes)
    {
        outMsg.userProfile = userProfileAttributes;
    }
    console.log("Send this message to bot:", outMsg);
    const body = Buffer.from(JSON.stringify(outMsg), 'utf8');

    const headers = {};
    headers['Content-Type'] = 'application/json; charset=utf-8';
    headers['X-Hub-Signature'] = buildSignatureHeader(body, channelSecretKey);

    request.post({
        uri: channelUrl,
        headers: headers,
        body: body,
        timeout: 60000,
        followAllRedirects: true,
        followOriginalHttpMethod: true,
        callback: function(err, response, body) {
            if (!err) {
                callback(null);
            } else {
                console.log(response);
                console.log(body);
                console.log(err);
                callback(err);
            }
        }
    });
}

module.exports = {
    messageToBot: messageToBot,
    verifyMessageFromBot: verifyMessageFromBot
}
