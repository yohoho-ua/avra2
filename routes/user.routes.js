module.exports = function(server) {

    var users = require('../cruds/userCrud');
    
     // Create a new User
     server.post('/users', users.createUser);

     // Retrieve all Users
     server.get('/users', users.findAllUsers);
 
     // Retrieve a single User with userId
     server.get('/users/:userId', users.findOneUser);
 
     // Update a User with userId
     server.put('/users/:userId', users.updateUser);
 
     // Delete a User with userId
     server.delete('/users/:userId', users.deleteUser);
}