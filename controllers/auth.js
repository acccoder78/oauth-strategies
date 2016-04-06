var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/user');
var Client = require('../models/client');
var BearerStrategy = require('passport-http-bearer').Strategy;
var Token = require('../models/token');
var DigestStrategy = require('passport-http').DigestStrategy;
var LocalStrategy = require('passport-local').LocalStrategy;

passport.use(new BasicStrategy(function(username, password, callback) {
    User.findOne({username: username}, function(err, user) {
        if (err) return callback(err);
        
        if (!user) return callback(null, false);
        
        user.verifyUser(password, function(err, isMatch) {
            if (err) return callback(err);
            
            if (!isMatch) return callback(null, false);
            
            return callback(null, user);
        });
    });
}));

passport.use('client-basic', new BasicStrategy(function(username, password, callback) {
    Client.findOne({id: username}, function (err, client) {
        if (err) return callback(err);
        
        if (!client || client.secret !== password) return callback(null, false);
        
        return callback(null, client);
    });
}));

passport.use(new BearerStrategy(function(accessToken, callback) {
    Token.findOne({ value: accessToken}, function(err, token) {
        if (err) return callback(err);
        
        if (!token) return callback(null, false);
        
        User.findOne({ _id: token.userId }, function(err, user) {
            if (err) return callback(err);
            
            if (!user) return callback(null, false);
            
            callback(null, user, { scope: '*'});
        });
    });
}));

passport.use(new DigestStrategy(
    { qop: 'auth'}, 
    function(username, callback) {
        User.findOne({ username: username }, function(err, user) {
           if (err)  return callback(err);
           
           if (!user) return callback(null, false);
           
           return   callback(null, user, user.password);
        });
    },
    function(params, callback) {
        callback(null, true);
    }
));

passport.use(new LocalStrategy(
    function(username, password, callback) {
        User.findOne({ username: username }, function(err, user) {
            if (err) return callback(err);
            
            if (!user) return (null, false);
            
            user.verifyUser(password, function(err, isMatch) {
                if (err) return callback(err);
                
                if(!isMatch) return callback(null, false);
                
                return callback(null, user);
            });
        })
    }
));

//exports.isAuthenticated = passport.authenticate(['basic', 'bearer'], { session: false });
//exports.isAuthenticated = passport.authenticate(['digest', 'bearer'], { session: false });
exports.isAuthenticated = passport.authenticate(['local', 'bearer'], { session: false });
exports.isClientAuthenticated = passport.authenticate('client-basic', { session: false });
exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false });