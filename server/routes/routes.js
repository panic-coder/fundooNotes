var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../model/user');
var bcrypt = require('bcryptjs');
var saltRounds = 10;
var async = require('async');
var nodemailer = require('nodemailer');
var Note = require('../model/note');
var jwt = require('jsonwebtoken');
var multer = require('multer');
var fs = require('fs');

/**
 * @description API for registration
 */
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

/**
 * @description API for Login
 */
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
                            email: doc.email,
                            label: doc.label,
                            profilePicture: doc.profilePicture,
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

/**
 * @description API for forgot password
 */
router.post('/forgot', (req, res, next) => {
    async.waterfall([
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
                console.log(err);
            }
            if (!user) {
                res.json({
                    success: false,
                    msg: "No acount with entered email address exists",
                    success_code: 404
                });
              }
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
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
        res.json({
            success: false,
            msg: "Something went wrong",
            success_code: 500
        });
      });
})

/**
 * @description API for reset password
 */
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
                user.resetPasswordToken = undefined;
                bcrypt.genSalt(saltRounds, function(err, salt) {
                    bcrypt.hash(req.body.password, salt, function(err, hash) {
                        if(err) {
                            return;
                        } 
                        user.password = hash;
                        user.save(function(err) {
                              done(err, user);
                            });                    
                        });
                });
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

/**
 * @description API for saving of notes
 */
  router.post('/savenote', function(req, res) {
      var newNote = new Note(req.body)
      Note.createNote(newNote, (err) => {
          if(err){
              res.json({
                  success: false,
                  msg: "Something went wrong",
                  err: err,
                  status_code: 500
              })
          } else {
              res.json({
                  success: true,
                  msg: "Note saved successfully",
                  status_code: 200
              })
          }
      });
  })

/**
 * @description API for updation of a note
 */
  router.put('/updatenote/:id', function(req, res) {
    Note.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, note) => {
        if(err){
            res.json({
                success: false,
                msg: "Something went wrong",
                status_code: 500
            })
        }
        res.json({
            success: true,
            msg: "Successfully updated",
            data: note,
            status_code: 200
        })
    })
  })

/**
 * @description API for deletion of a note
 */
  router.delete('/deletenote/:id', function(req, res) {
      Note.findByIdAndRemove(req.params.id, (err, note) => {
          if(err){
              res.json({
                  success: false,
                  msg: "Something went wrong",
                  status_code: 500
              })
          }
          res.json({
              success: true,
              msg: "Successfully deleted",
              data: note,
              status_code: 200
          })
      })
  })
/**
 * @description API for reading of notes from database
 */
  router.get('/readnote/:note_id', function(req, res) {
    var id = mongoose.Types.ObjectId(req.params.note_id);
      Note.find({"userId": id}, (err, notes) => {
          if(err){
            res.json({
                success: false,
                msg: "Something went wrong",
                status_code: 500
            })
          }
          res.json({
              success: true,
              msg: "Successfully taken data from db",
              data: notes,
              status_code: 200
          })
      })
  })

/**
 * @description API for uploading image
 */
router.post("/upload", multer({dest: "./uploads/"}).array("image", 12), function(req, res) {
    var fileInfo = [];
    for(var i = 0; i < req.files.length; i++) {
        fileInfo.push({
            "originalName": req.files[i].originalName,
            "size": req.files[i].size,
            "b64": new Buffer(fs.readFileSync(req.files[i].path)).toString("base64")
        });
        fs.unlink(req.files[i].path);
    }
    res.send(fileInfo);
});

/**
 * @description API for searching email and checking if the user is registered or not for adding before collaboration
 */
router.post('/collabEmailSearch', function(req, res) {
    User.findOne({"email":req.body.email}, function(err, user) {
        if(err) {
            res.json({
                success:false,
                err:err,
                status_code: 500
            })    
        }
        if(user == null){
            res.json({
                success:false,
                res:"Not a registered user",
                status_code: 404
            })    
        }
        if(user != null){
            res.json({
                success:true,
                data:user,
                status_code: 200
            })    
        }
        
    })
})

/**
 * @description API for updation of a user
 */
router.put('/updateuser/:id', function(req, res) {
    
    var ObjectId = (require('mongoose').Types.ObjectId);
    var id = req.params.id
    var query = {'_id': new ObjectId(id)}
    User.findOne(query, (err, userData) => {
        if(err){
            res.json({
                success: false,
                msg: "Something went wrong",
                status_code: 500
            })
        }
        userData.label = req.body ;
        userData.save();
        res.json({
            success: true,
            msg: "Successfully updated",
            data: userData,
            status_code: 200
        })
    })
  })

  /**
   * @description API for getting all label according to the user
   */
  router.get('/getLabels/:id', function(req, res) {
    var ObjectId = (require('mongoose').Types.ObjectId);
    var id = req.params.id
    var query = {'_id': new ObjectId(id)}
    User.findOne(query, (err,userData) => {
        if(err) {
            res.json({
                success: false,
                msg: "Something went wrong",
                status_code: 500
            })
        }

        res.json({
            success: true,
            msg: "Successfully read label",
            label: userData.label ,
            status_code: 200
        })
    })
  })

  /**
   * @description API for removing collaboration
   */
  router.post('/deletecollab', function(req, res) {
      User.find({"email": req.body.email}, function(err, doc) {
        if(err) {
            res.json({
                success: false,
                success_code: 500
            })
        }

            Note.find({"userId":doc[0]._id}, function(err, docChat) {
                if(err) {
                    res.json({
                        success: false,
                        success_code: 500
                    })  
                }
                var foundDoc;
                docChat.forEach(element => {
                    if(element.collaborators != null){
                        element.collaborators.forEach(elementCollab => {
                            if(elementCollab.email == req.body.email && element.title == req.body.title){
                                foundDoc = element;
                            }
                        })
                    }
                });
                res.json({
                    success: true,
                    success_code: 200,
                    doc: foundDoc    
                })
            })
        })
    })

    /**
     * @description API for profile picture upload
     */
    router.put('/profilepicupload/:id', function(req, res) {
        var ObjectId = (require('mongoose').Types.ObjectId);
        var id = req.params.id
        var query = {'_id': new ObjectId(id)}
        User.findOne(query, (err, userData) => {
            if(err){
                res.json({
                    success: false,
                    msg: "Something went wrong",
                    status_code: 500
                })
            }
            userData.profilePicture = req.body.image ;
            userData.save();
            res.json({
                success: true,
                msg: "Successfully updated",
                data: userData,
                status_code: 200
            })
        })
    })

    

/**
 * @description Getting all the routes available in exports module
 */
module.exports = router; 
