process.env.NODE_ENV = 'test';


// var expect  = require("chai").expect;
// var request = require("request");

let mongoose = require("mongoose");
let User = require('../models/user');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);

//Our parent block
describe('users', () => {
    beforeEach((done) => { //Before each test we empty the database
        User.remove({}, (err) => { 
           done();         
        });     
    });
/*
  * Test the /GET route
  */
  describe('/GET users', () => {
    it('it should GET all the users', (done) => {
      chai.request(server)
    // chai.request('http://localhost:5000')
          .get('/users')
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('array');
              res.body.length.should.be.eql(0);
            done();
          });
    });
});

/*
  * Test the /POST route
  */
  describe('/POST user', () => {
    it('it should not POST a user without email field', (done) => {
        let user = {
            username: "John",
            //email: "123@123.com",
            password: "password"
        }
          chai.request(server)
          .post('/users')
          .send(user)
          .end((err, res) => {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('email');
                res.body.errors.email.should.have.property('kind').eql('required');
            done();
          });
    });
    it('it should POST a user ', (done) => {
        let user = {
            username: "John",
            email: "123@123.com",
            password: "password"
        }
          chai.request(server)
          .post('/users')
          .send(user)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('User successfully created!');
                res.body.user.should.have.property('username');
                res.body.user.should.have.property('email');
                res.body.user.should.have.property('password');
            done();
          });
    });
});
/*
  * Test the /GET/:id route
  */
  describe('/GET/:id user', () => {
	  it('it should GET a user by the given id', (done) => {
	  	let user = new User({ username: "Yoda", email: "nabu@imp.com", password: "may4" });
	  	user.save((err, user) => {
	  		chai.request(server)
		    .get('/users/' + user.id)
		    .send(user)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
                res.body.should.have.property('username');
                res.body.should.have.property('email');
                res.body.should.have.property('password');
			  	res.body.should.have.property('_id').eql(user.id);
		      done();
		    });
	  	});
			
	  });
  });

  /*
  * Test the /PUT/:id route
  */
  describe('/PUT/:id user', () => {
    it('it should UPDATE a user given the id', (done) => {
        let user = new User({ username: "Yoda", email: "nabu@imp.com", password: "may4" });
        user.save((err, user) => {
              chai.request(server)
              .put('/users/' + user.id)
              .send({name: "YodaGreen", email: "nabu@imp.com", password: "may4" })
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('User successfully updated!');
                    res.body.user.should.have.property('username').eql("YodaGreen");
                done();
              });
        });
    });
});

 /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:id user', () => {
    it('it should DELETE a user given the id', (done) => {
        let user = new User({ name: "Yoda", email: "nabu@imp.com", pass: "may4" });
        user.save((err, user) => {
              chai.request(server)
              .delete('/users/' + user.id)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('User deleted successfully!');
                    res.body.result.should.have.property('ok').eql(1);
                    res.body.result.should.have.property('n').eql(1);
                done();
              });
        });
    });
});

});