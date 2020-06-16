var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/demo/home');
});

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('templated_home', {});
});

/* GET home page. */
router.get('/oldpage', function(req, res, next) {
  res.render('home', {});
});

/* GET status page. */
router.get('/status', function(req, res, next) {
  res.render('status', {});
});

module.exports = router;
