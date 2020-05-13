'use strict'
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'opticatopevision@gmail.com',
      pass: 'topevision'
    }
  });


  module.exports=transporter;