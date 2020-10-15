'use strict'
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');


var options = {
  auth: {
    api_user: 'opticatopevision@gmail.com',
    api_key: 'topevisionevolution'
  }
}

var transporter = nodemailer.createTransport(sgTransport(options));



  module.exports=transporter;