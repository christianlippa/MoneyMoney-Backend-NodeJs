var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var router = express.Router();
var mongoInsert = require("./database/insertData.js");
var mongoGet = require("./database/getData.js");
var mongoClient = require('mongodb').MongoClient;


/* GET user profile. */
router.get('/', ensureLoggedIn, function(req, res, next) {
  res.render('profile', { user: req.user });
});

/* GET user data. */
router.post('/getData', ensureLoggedIn, function(req, res, next) {
    mongoGet.getData(req.body, function callback(data) {
    res.json(data);
  });
});
/* GET user data API. */
router.post('/getDataAPI', function(req, res, next) {
    mongoGet.getData(req.body, function callback(data) {
    res.json(data);
  });
});

/* POST user data. */
router.post('/insertData', ensureLoggedIn, function(req, res, next) {
  console.log(req.body);
  mongoInsert.insertData(req.body, function callback(err){
    if(err==null){
      res.sendStatus(200);
    }
  });
});
/* POST user data API. */
router.post('/insertDataAPI', function(req, res, next) {
  console.log(req.body);
  mongoInsert.insertData(req.body, function callback(err){
    if(err==null){
      res.sendStatus(200);
    }
  });
});

/* GET user graphs. */
router.get('/graphs' , ensureLoggedIn, function(req,res,next) {
  res.render('graphs', { user: req.user });
});

module.exports = router;
