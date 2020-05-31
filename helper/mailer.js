var nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'emailid',
      pass: 'password'
    }
});

module.exports = transporter;