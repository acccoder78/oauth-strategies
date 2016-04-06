var User = require('../models/user');

exports.addUsers = function(req, res) {
    var user = new User({
        username: req.body.username,
        password: req.body.password
    });
    
    user.save(function(err) {
        if (err) return res.send(err);
        
        res.json({message: "New user:" + user.username + " added to the beer locker!"});
    });
};

exports.getUsers = function(req, res) {
    User.find(function(err, users) {
        if (err) return res.send(err);
        
        res.json(users);
    });
};

exports.removeUser = function(req, res) {
    if (req.body.username === undefined) 
        return res.json({message: "Please enter a valid user to remove!"});
    
    User.remove({username: req.body.username}, function(err) {
        if (err) return res.send(err);
    
        res.json({message: "The user: " + req.body.username + " removed from beer locker!"});
    });
};