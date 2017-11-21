const chatServer = require('../smooch/smooch-server');

module.exports = function (router , config) {
    // do smooch server integration!
    chatServer.init(router, config);
}
