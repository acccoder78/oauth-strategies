var Beer = require('../models/beer');

exports.addBeer = function(req, res) {
    var beer = new Beer();
    
    beer.name = req.body.name;
    beer.type = req.body.type;
    beer.quantity = req.body.quantity;
    beer.userId = req.user._id;
    
    beer.save(function(err) {
        if (err) return res.send(err);
        
        res.json({message: "Beer '"+ beer.name + "' added to the locker!"});
    });
};

exports.getBeers = function(req, res) {
    Beer.find({userId: req.user._id}, function(err, beers) {
        if (err) return res.send(err);
        
        res.json(beers);
    });
};

exports.getBeerById = function(req, res) {
    Beer.find({_id: req.params.beer_id, userId: req.user._id}, function(err, beer) {
        if (err) return res.send(err);
        
        res.json(beer);
    });
};

exports.getBeerByName = function(req, res) {
    Beer.find({userId: req.user._id, name: req.params.beer_name}, function(err, beer) {
        if (err) return res.send(err);
        
        res.json(beer);
    });
};

/*
//option 1 of implementing quantity update function

exports.putBeer = function(req, res) {
    Beer.findById({userId: req.user._id, _id: req.params.beer_id}, function(err, beer) {
        if (err) return res.send(err);
        
        beer.quantity = req.body.quantity;
        
        beer.save(function(err) {
            if (err) return res.send(err);
            
            res.json(beer);
        });
    });
}
*/

//option 2 of implementing quantity update function

exports.putBeer = function(req, res) {
    Beer.update({userId: req.user._id, _id: req.params.beer_id}, {quantity: req.body.quantity}, function(err, beer) {
        if (err) return res.send(err);
        
        res.json(beer);
    });
};

exports.deleteEmptyBeer = function(req, res) {
    console.log("user: "+req.user._id+"; beer_id: "+req.params.beer_id);
    
    Beer.find({_id: req.params.beer_id, userId: req.user._id}, function(err, beers) {
        if (err) return res.send(err);
        
        var msg = "";
        
        console.log("user: "+req.user._id+"; beer: "+beers.length);
        
        if (!beers.length) {
            msg = "The specified beer doesn\'t exist in the locker!";
        }
        else if ((!beers[0].quantity) || (beers[0].quantity <= 0)) {
            Beer.remove({_id: req.params.beer_id}, function(err) {
                if (err) return res.send(err);
            });
            
            msg = "Beer '" + beers[0].name + "' has been removed from locker!";
        }
        else {
            msg = "Beer '" + beers[0].name + "' not removed from locker as its not empty yet!";
        }
        res.json({message: msg});
    });
};

exports.deleteBeer = function(req, res) {
    console.log("user: "+req.user._id+"; beer_id: "+req.params.beer_id);
    
    Beer.find({_id: req.params.beer_id, userId: req.user._id}, function(err, beers) {
        if (err) return res.send(err);
        
        var msg = "";
        
        console.log("user: "+req.user._id+"; beer: "+beers.length);
        
        if (!beers.length) {
            msg = "The specified beer doesn\'t exist in the locker!";
        }
        else {
            Beer.remove({_id: req.params.beer_id}, function(err) {
                if (err) return res.send(err);
            });
            
            msg = "Beer '" + beers[0].name + "' has been removed from locker!";
        }
        res.json({message: msg});
    });
};

exports.deleteAll = function(req, res) {
    console.log("**user: " + req.user._id);
        
    Beer.remove({userId: req.user._id}, function(err) {
        if (err) return res.send(err);
        
        res.json({message: "All beers for "+ req.user._id + " removed from locker!"});
    });
};
