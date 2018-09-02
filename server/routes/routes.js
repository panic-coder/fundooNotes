var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../model/user');
var bcrypt = require('bcryptjs');
var saltRounds = 10;
var crypto = require('crypto');
var async = require('async');
var nodemailer = require('nodemailer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var jwt = require('jsonwebtoken');

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
        if(doc == null){
            res.json({
            success: false,
            msg: "Not a registered user",
            status_code: 404
        })
        }
        if(doc!=null)
            try{
                bcrypt.compare(req.body.password, doc.password, (err, result) => {
                    if(err){
                        res.json({
                            success: false,
                            msg: "Wrong password",
                            status_code: 403
                        })
                    }
                    if(result){
                        var token = jwt.sign({
                            data: doc._id,
                            name: doc.name,
                            email: doc.email
                          }, 'secret', { expiresIn: '24h' })
                        res.json({
                            success: true,
                            token: token,
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
              }, 'secret', { expiresIn: '24h' }, function(err, token){
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
                // res.flash('error', 'No account with that email address exists.');
                res.json({
                    success: false,
                    msg: "No acount with entered email address exists",
                    success_code: 404
                });
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
                'http://localhost:4200/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
            //   res.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
            res.json({
                success: true,
                msg: 'An e-mail has been sent to ' + user.email + ' with further instructions.',
                success_code: 200
            });
              done(err, 'done');
            });
          }
    ], function(err) {
        if (err) return next(err);
        //   res.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        res.json({
            success: false,
            msg: "Something went wrong",
            success_code: 500
        });
      });
})

router.post('/reset', function(req, res) {
    async.waterfall([
      function(done) {
        var newToken = req.body.token;
        jwt.verify(newToken, 'secret', function(err, decoded){
            if(err) {
                    res.json({
                        success: false,
                        msg: "Token expired",
                        status_code: 403
                    })
            }
            console.log(decoded);
            User.findOne({ resetPasswordToken: req.body.token }, function(err, user) {
                if (err){
                    res.json({
                        success: false,
                        msg: "Something went wrong",
                        status_code: 403
                   })
                }
                if (!user) {
                    res.json({
                        success: false,
                        msg: "User Not Found",
                        status_code:404
                   })
                }
        
                //user.password = req.body.password;
                user.resetPasswordToken = undefined;
                bcrypt.genSalt(saltRounds, function(err, salt) {
                    console.log(salt);
                    
                    bcrypt.hash(req.body.password, salt, function(err, hash) {
                        // Store hash in your password DB.
                        if(err) {
                            return;
                        } 
                        user.password = hash;
                        user.save(function(err) {
                              done(err, user);
                            });                    
                        });
                });
                //user.resetPasswordExpires = undefined;
        
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
            res.json({
                success: true,
                msg: "Successfully changed password",
                status_code: 200
           })
          done(err);
        });
      }
    ], function(err) {
        res.json({
            success: false,
            msg: "Something went wrong",
            status_code: 500
       })
    });
  });

module.exports = router; //Getting all the routes available in exports module
