const request = require('supertest');
const sinon = require('sinon')
//const app = require('/routes/index');
const app = require('../app');
const expect = require('chai').expect;
var Airplaine = require('../models/Airplaines');
var randomstring = require('randomstring');


describe('Login API', function() {
    it('Should success if credential is unvalid', function(done) {
        request(app)
            .post('/login')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({ username: 'username', password: 'password' })
            .expect(401)
            .expect('Content-Type', /json/)
            .expect(function(response) {
                expect(response.body).not.to.be.empty;
                expect(response.body).to.be.an('object');
            })
            .end(done);
    });
});

describe('Login API', function() {
    it('Should success if credential is valid', function(done) {
        request(app)
            .post('/login')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({ username: 'test', password: 'test' })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(response) {
                expect(response.body).not.to.be.empty;
                expect(response.body).to.be.an('object');
            })
            .end(done);
    });
});

describe('GET ', function(){
    it('respond with json', function(done){
        request(app)
            .get('/posts')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res){
                if (err) return done(err);
                done()
            });
    })
});

describe('Register API', function() {
    it('Should succes if credentials excist', function(done) {
        request(app)
            .post('/register')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({ username: 'test', password: 'test' })
            .expect(500)
            .expect('Content-Type', /json/)
            .expect(function(response) {
                expect(response.body).not.to.be.empty;
                expect(response.body).to.be.an('object');
            })
            .end(done);
    });
});
describe('Register API', function() {
    it('Should succes if credentials dont excist', function(done) {
        request(app)
            .post('/register')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({ username: randomstring.generate(5), password: randomstring.generate(5) })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(response) {
                expect(response.body).not.to.be.empty;
                expect(response.body).to.be.an('object');
            })
            .end(done);
    });
});

describe('Airplaine', function() {
    describe('#save()', function() {
        it('should save without error', function(done) {
            var plain = new Airplaine()

            plain.save(function(err) {
                if (err) done(err);
                else done();
            });
        });
    });
});

/*

describe('MainController', function() {
    beforeEach(module('flapperNews'));

    var $controller;

    beforeEach(inject(function(_$controller_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));

    describe('addPost', function(){
        it('add a post', function(){
            var $scope = {};
            var posts = {};
            var auth = {};
            var $scope.title = "just a testing title to try";
            var $scope.link = "www.justatest.com";
            var controller = $controller('MainCtrl', { $scope : $scope, $posts : $posts, $auth : $auth});
            $scope.addPost();
            expect($scope.posts.length).toEqual(1);
        })
    })

});
*/
