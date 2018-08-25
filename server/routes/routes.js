var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../model/user');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var async = require('async');
var session = require('express-session')
var nodemailer = require('nodemailer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('express-flash');
var jwt = require('jsonwebtoken');

app.use(flash());


router.post('/register', (req, res) => {
    var newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        dob: req.body.dob
    })
    User.addUser(newUser, (err) => {
        if(err){
            res.json({
                success: false,
                msg: "Failed to register",
                status_code: 500
            })
        } else {
            res.json({
                success: true,
                msg: "Reistered Successfully",
                status_code: 200
            })
        }
    })
})

router.post('/login', (req,res) => {
    User.findOne({
        "email":req.body.email
    }, function (err, doc) {
        if(err){
            res.json({
                success: false,
                msg: "Not a registered user",
                status_code: 404
            })
        }
        console.log("In  "+req.body.password);
        console.log("db  "+doc.password);
        
        try{
            bcrypt.compare(req.body.password, doc.password, (err, result) => {
                if(err){
                    res.json({
                        success: false,
                        msg: "Something went wrong",
                        status_code: 500
                    })
                }
                if(result){
                    res.json({
                        success: true,
                        msg: "Successfully logged in",
                        status_code: 200
                    })
                } else {
                    res.json({
                        success: false,
                        msg: "Something went wrong",
                        status_code: 500
                    })
                } 
            })
        } catch (Exception){
            console.log(Exception);
        }
    })
})

router.post('/forgot', (req, res, next) => {
    var email = req.body.email;
    console.log(email);
    async.waterfall([
        // function(done) {
        //     crypto.randomBytes(20, function(err, buf) {
        //         var token = buf.toString('hex');
        //         done(err, token);
        //       });
        // },
        function(done) {
            jwt.sign({
                data: req.body.email
              }, 'secret', { expiresIn: '1h' }, function(err, token){
                  done(err, token);
              });
        },
        function(token, done){
        User.findOne({
            "email": req.body.email
        }, function (err, user) {
            if(err) {
                // res.json({
                //     success: false,
                //     msg: "Not a registered user",
                //     status_code: 404
                // })
            }
            if (!user) {
                req.flash('error', 'No account with that email address exists.');
                return res.redirect('/forgot');
              }
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            //var data = new User(req.body);
            
            user.save(function(err) {
                if(err) throw err;
                done(err, token, user);
            });
            })
        },
        function(token, user, done) {
            var smtpTransport = nodemailer.createTransport({
              service: 'Gmail',
              auth: {
                user: 'utility.services.development@gmail.com',
                pass: 'bridgeit0'
              }
            });
            var mailOptions = {
              to: user.email,
              from: 'utility.services.development@gmail.com',
              subject: 'Node.js Password Reset',
              text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
              req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
              done(err, 'done');
            });
          }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/forgot');
      });
})

router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        var newToken = req.params.token;
        jwt.verify(newToken, 'secret', function(err, decoded){
            if(err) {
                    res.json({
                    success: false,
                    msg: "Token expired"
               })
            }
            console.log(decoded);
            User.findOne({ resetPasswordToken: req.params.token }, function(err, user) {
                if (err){

                }
                if (!user) {
                  //req.flash('error', 'Password reset token is invalid or has expired.');
                  return res.redirect('back');
                }
        
                user.password = req.body.password;
                user.resetPasswordToken = undefined;
                //user.resetPasswordExpires = undefined;
        
                user.save(function(err) {
                  //req.logIn(user, function(err) {
                    done(err, user);
                  });
               // });
              });
        });
        
        

      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport( {
          service: 'Gmail',
          auth: {
            user: 'utility.services.development@gmail.com',
            pass: 'bridgeit0'
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'utility.services.development.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/');
    });
  });

module.exports = router; //Getting all the routes available in exports module
