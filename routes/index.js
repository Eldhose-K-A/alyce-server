var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //req.session.sid = "Hi Socket!...";
  //res.render('index', { title: 'Express' });
  res.redirect('/pageone.html');
});

module.exports = router;
