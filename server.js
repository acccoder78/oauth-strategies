var express = require('express');
var mongoose = require('mongoose');
var port = process.env.port || 3000;
var Beer = require('./models/beer');
var bodyParser = require('body-parser');
var beerController = require('./controllers/beer');
var userController = require('./controllers/user');
var passport = require('passport');
var authController = require('./controllers/auth');
var clientController = require('./controllers/client');
var ejs = require('ejs');
var session = require('express-session');
var oauth2Controller = require('./controllers/oauth2');
var cookieParser = require('cookie-parser');

mongoose.connect('mongodb://localhost:27017/beerlocker');

var app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieParser());

app.use(session({
    secret: 'super secret session key',
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());

var router = express.Router();

router.get('/', function(req, res) {
    res.json({message: "you are running low on beer!"});
});

router.route('/beers')
    .post(authController.isAuthenticated, beerController.addBeer)
    .get(authController.isAuthenticated, beerController.getBeers);

//router.route('/beers/:beer_name')
  //  .get(authController.isAuthenticated, beerController.getBeerByName);

router.route('/beers/:beer_id')
    .get(authController.isAuthenticated, beerController.getBeerById)
    .put(authController.isAuthenticated, beerController.putBeer)
    .delete(authController.isAuthenticated, beerController.deleteBeer);
    
router.route('/beers/all')
    .delete(authController.isAuthenticated, beerController.deleteAll);

router.route('/users')
    .post(userController.addUsers)
    .get(authController.isAuthenticated, userController.getUsers)
    .delete(authController.isAuthenticated, userController.removeUser);
    
router.route('/clients')
    .post(authController.isAuthenticated, clientController.addClient)
    .get(authController.isAuthenticated, clientController.getClients);
    
router.route('/oauth2/authorize')
    .get(authController.isAuthenticated, oauth2Controller.authorization)
    .post(authController.isAuthenticated, oauth2Controller.decision);
    
router.route('/oauth2/token')
    .post(authController.isClientAuthenticated, oauth2Controller.token);

app.use('/api', router);

app.listen(port);