var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../model/user');

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

module.exports = router; //Getting all the routes available in exports module
