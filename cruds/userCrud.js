var User = require('../models/user');

exports.createUser = function(req, res) {
    // Create and Save a new User
    var req_name = req.body.name;
    var req_email = req.body.email;
    var req_pass = req.body.pass;

    if(req_name == "" || req_email == "" || req_pass == "") {
        res.status(400).send({message: "Filelds can not be empty"});
    }

    var newUser = new User({username: req_name, email: req_email, password: req_pass});

    newUser.save(function(err, user) {
        if(err) {
            res.status(500).send(err);
        } else {
            res.json({message: "User successfully created!", user });
        }
    });
};

exports.findAllUsers = function(req, res) {
    // Retrieve and return all users from the database.
    User.find(function(err, data){
        if(err) {
            res.status(500).send({message: "Some error ocuured while retrieving users."});
        } else {
            res.json(data);
        }
    });
};

exports.findOneUser = function(req, res) {
    // Find a single User with a userId
    User.findById(req.params.userId, function(err, user) {
        if(err) {
            res.status(500).send({message: "Could not retrieve user with id " + req.params.userId});
        } else {
            res.json(user);
        }
    });
};

exports.updateUser = function(req, res) {
    // Update a user identified by the userId in the request
    User.findById(req.params.userId, function(err, existent_user) {
        if(err) {
            res.status(500).send({message: "Could not find a user with id " + req.params.userId});
        }

        existent_user.username = req.body.name;
        existent_user.email = req.body.email;
        existent_user.password = req.body.pass;

        existent_user.save(function(err, user){
            if(err) {
                res.status(500).send({message: "Could not update user with id " + req.params.userId});
            } else {
                res.json({message: "User successfully updated!", user });
            }
        });
    });
};

exports.deleteUser = function(req, res) {
    // Delete a user with the specified userId in the request
    User.remove({_id: req.params.userId}, function(err, result) {
        if(err) {
            res.status(500).send({message: "Could not delete user with id " + req.params.id});
        } else {
            res.json({message: "User deleted successfully!", result})
        }
    });
};

//export all the functions
//module.exports = { create, findAll, findOne, update, delete };