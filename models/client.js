var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var ClientSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    id: { type: String, required: true },
    secret: { type: String, required: true },
    userId: { type: String, required: true }
});

ClientSchema.methods.hashCredentials = function(flag, callback) {
    var client = this;
    
    bcrypt.genSalt(5, function(err, salt) {
        if (err) return callback(err);
        
        switch (flag) {
            case 'id':
                bcrypt.hash(client.id, salt, null, function(err, hash) {
                    if (err) return callback(err);
                    
                    client.id = hash;
                    callback();
                });
                break;
            case 'secret':
                bcrypt.hash(client.secret, salt, null, function(err, hash) {
                    if (err) return callback(err);
                    
                    client.secret = hash;
                    callback();
                });
            default:
                bcrypt.hash(client.id, salt, null, function(err, hash) {
                    if (err) return callback(err);
                    
                    client.id = hash;
                });
    
                bcrypt.hash(client.secret, salt, null, function(err, hash) {
                    if (err) return callback(err);
                    
                    client.secret = hash;
                });
                callback();
        }
        
    });
};

module.exports = mongoose.model('Client', ClientSchema);