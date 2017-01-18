var express = require('express');
var passport = require('passport');
var router = express.Router();

var env = {
  AUTH0_CLIENT_ID: 'epRgjVF15vGKLJEL8EjVGV241IImwDW2',
  AUTH0_DOMAIN: 'moneymoney.auth0.com',
  AUTH0_CALLBACK_URL: 'moneymoney.zapto.org/callback'
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MoneyMoney', env: env });
});

/* GET contact page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact', env: env });
});

/* GET login page. */
router.get('/login',
  function(req, res){
    res.render('login', { env: env });
  });

/* GET logout. */
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

/* GET callback. */
router.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect(req.session.returnTo || '/user');
});


module.exports = router;
