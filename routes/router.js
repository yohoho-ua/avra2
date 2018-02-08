var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Wallet = require('../models/wallet');
var generator = require('../walletGenerator');

// GET route for reading data
router.get('/', function (req, res, next) {
  res.sendFile('/index.html', {root: './templateLogReg'})
});


//POST route for updating data
router.post('/', function (req, res, next) {
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
      //crate wallet

    var walletData = {
      userId : user._id,
      public : generator.getPublic(),
      private :  generator.getPrivate(),
      balance :  0
    }
    Wallet.create(walletData, function (error, wallet){
      if (error) {
        return next(error);
      }
      console.log("wallet created");
      console.log("wallet");
    })
        req.session.userId = user._id;
        return res.redirect('/profile');
        //res.render('pages/profile');
      }
    });

  } else if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
        
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

// GET route after registering
router.get('/profile', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          // return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
          // res.sendFile('/profile.html', {root: './templateLogReg'})
          Wallet.find({userId: user._id})
          .exec(function(error, wallets){
            if (error) {
              return next(error);
            }
            res.render('pages/profile', {user : user, wallets: wallets});
          })
        }
      }
    });
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});
///////////////////
//CRUD routes

var users = require('../cruds/userCrud');
// Create a new User
router.post('/users', users.createUser);

// Retrieve all Users
router.get('/users', users.findAllUsers);

// Retrieve a single User with userId
router.get('/users/:userId', users.findOneUser);

// Update a User with userId
router.put('/users/:userId', users.updateUser);

// Delete a User with userId
router.delete('/users/:userId', users.deleteUser);


module.exports = router;