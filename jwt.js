var jwt = require('jsonwebtoken');
var token = jwt.sign({scope: 'app'}, 'x8-pWt3hDpqrFjFHfKUuNt2Z', {header: {kid: 'app_59af5f1be71e915200e754df'}});

console.log(token);

//console.log(token);

//const fs = require('fs');
/*const jwa = require('jwa');
const hmac256 = jwa('HS256');
//const rsassa = jwa('RS512');
//const rsassaShort = jwa('RS256');

// const signingPrivateKey  = fs.readFileSync('./server_keys/jwtsigningPrivate.key');
// const signingPublicKey = fs.readFileSync('./server_keys/jwtsigningPublic.pem');
//const signingPrivateKey  = fs.readFileSync('./keystore_dabbles/signingprivate.key');
//const signingPublicKey = fs.readFileSync('./keystore_dabbles/signingpublic.crt');

const hmacSecret = "x8-pWt3hDpqrFjFHfKUuNt2Z";

const TOKEN_EXPIRY = 3600000; //1 hour

var user = 'oamadmin';

var tokenExpiry = Date.now() + TOKEN_EXPIRY;
var header = {
  "alg": "HS256",
  "typ": "JWT",
  "kid":"app_59af5f1be71e915200e754df"
};
var payload = {
    "scope": "appUser",
    "userId": "bob@example.com"
};
var tokenstr = Buffer.from(JSON.stringify(header)).toString('base64') +"."
            +Buffer.from(JSON.stringify(payload)).toString('base64');
//Generate the signature
//var signature = rsassa.sign(tokenstr, signingPrivateKey);
//var signatureShort = rsassaShort.sign(tokenstr, signingPrivateKey);
var signatureHMAC = hmac256.sign(tokenstr, hmacSecret)

//console.log("JWT is " +(rsassa.verify(tokenstr, signature, signingPublicKey) ? "valid!" : "not valid :(") );
//console.log("JWT short sig is " +(rsassaShort.verify(tokenstr, signatureShort, signingPublicKey) ? "valid!" : "not valid :(") );
console.log("JWT HMAC " +(hmac256.verify(tokenstr, signatureHMAC, hmacSecret) ? "valid!" : "not valid :(") );
console.log("HMAC JWT: " +tokenstr +"." +signatureHMAC);*/

//console.log("Encoded: " +encodeURIComponent(tokenstr)+"." +encodeURIComponent(signatureHMAC));
