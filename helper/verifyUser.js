const con = require('./connectDb');
const errorResolver = require('./errorResolver');
const sanitizer = require('sanitizer');

var sessionVerifier = (req, res, next) => {
    next();   
};

module.exports = sessionVerifier;