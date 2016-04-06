var oauth2 = require('oauth2orize');
var Client = require('../models/client');
var Code = require('../models/code');
var Token = require('../models/token');
var User = require('../models/user');
var uid = require('uid');

var server = oauth2.createServer();

server.serializeClient(function(client, callback) {
    return callback(null, client._id);
});

server.deserializeClient(function(id, callback) {
    Client.findOne({ _id: id }, function(err, client) {
        if (err) return callback(err);
        
        return callback(null, client);
    });
});

server.grant(oauth2.grant.code(function(client, redirectUri, user, ares, callback) {
    var code = new Code({
        value: uid(16),
        redirectUri: redirectUri,
        clientId: client._id,
        userId: user._id
    });
    
    console.log("grandted acces with the code:"+code.value);
    
    code.save(function(err) {
        if (err) return callback(err);
        
        callback(null, code.value);
    });
}));

server.exchange(oauth2.exchange.code(function(client, code, redirectUri, callback) {
    console.log("we are entering the exchange zone");
    
    Code.findOne({ value: code }, function(err, authCode) {
        if (err) return callback(err);
        
        console.log("we got the auth code:"+code);
        
        if (!authCode) return callback(null, false);
        
        console.log("The authcode is not null:"+authCode.clientId);
        
        if (client._id.toString() !== authCode.clientId) return callback(null, false);
        
        console.log("the auth code is not null and matched the cliendid:"+authCode.clientId);
        
        if (redirectUri !== authCode.redirectUri) return callback(null, false);
        
        console.log("matched the redirectUri:"+authCode.redirectUri);
        
        authCode.remove(function(err) {
            if (err) return callback(err);
            
            var token = new Token({
                value: uid(256),
                clientId: authCode.clientId,
                userId: authCode.userId
            });
            
            token.save(function(err) {
                if (err) return callback(err);
                
                callback(null, token);
            });
        });
    });
}));

exports.authorization = [
    server.authorization(function(clientId, redirectUri, callback) {
       Client.findOne({ id: clientId }, function(err, client) {
           if (err) return callback(err);
           
           return callback(null, client, redirectUri);
       });
    }),
    function(req, res) {
        res.render('dialog', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client});
    }
]

exports.decision = [
    server.decision(function(req, callback) {
        return callback(null, { scope: req.scope} )
    })
]

exports.token = [
    server.token(),
    server.errorHandler()
]

