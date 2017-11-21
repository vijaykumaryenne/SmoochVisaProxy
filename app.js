const express = require('express');
const fs = require('fs');
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');
const Constants = require('./utils/Constants');
const smoochIbRouter = require('./routes/addSmoochIBRoute');
var app = express();


let router = express.Router();

router.use(bodyParser.json({
    verify: verifyBotMessage
}));

/*
 Simply store the raw buffer in the request for later verification.
 */
function verifyBotMessage(req, res, buf, encoding) {
    req.rawBody = buf;
    req.encoding = encoding;
}

const root = __dirname;

const sslOptions = {
    key: fs.readFileSync(root + '/bots-samples-nodejs.key'),
    cert: fs.readFileSync(root + '/bots-samples-nodejs.pem')
};


const config = {
    IB_WEBHOOK_URL: Constants.IB_WEBHOOK_URL,
    IB_WEBHOOK_SECRET: Constants.IB_WEBHOOK_SECRET,
    SMOOCH_KEY_ID: Constants.SMOOCH_KEY_ID,
    SMOOCH_SECRET: Constants.SMOOCH_SECRET,
    USE_PROXY: Constants.USE_PROXY,
    PROXY: Constants.PROXY,
    sslOptions: sslOptions
};

console.log('Adding SmoochIB router');
app.use('/', router);
smoochIbRouter(router, config);

const httpServer = http.createServer(app);
//const httpsServer = https.createServer(config.sslOptions, app);

httpServer.listen(Constants.PORT, function() {
    console.info('Smooch-IB server is listening on HTTP port ', Constants.PORT);
});
/*httpsServer.listen(Constants.PORT + 1, function() {
    console.info('Smooch-IB server is listening on HTTPS port', Constants.PORT + 1);
});*/
