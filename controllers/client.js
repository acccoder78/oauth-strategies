var Client = require('../models/client');
var bcrypt = require('bcrypt-nodejs');

exports.addClient = function(req, res) {
  var client = new Client();
  
  client.name = req.body.name;
  client.id = req.body.id;
  client.secret = req.body.secret;
  client.userId = req.user._id;
  
  console.log("hashsed id:"+client.id);
  
  client.save(function(err) {
    if (err) return res.send(err);
    
    res.json({ message: "A new client: " + client.name + " added to the locker", data: client });
  });
/*    
  client.hashCredentials(null, function(err) {
    if (err) return res.send(err);
    
    client.save(function(err) {
      if (err) return res.send(err);
      
      res.json({ message: "A new client: " + client.name + " added to the locker", data: client });
    });
  }); */
};

exports.getClients = function(req, res) {
  Client.find({ userId: req.user._id }, function(err, clients) {
      if (err) return res.send(err);
      
      res.json(clients);
  });  
};

