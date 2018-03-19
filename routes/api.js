var mongoose = require('mongoose');
var config = require('../config/database');
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/User");
var Email = require("../models/Email");

//Create router for signup or register the new user.

router.post('/signup', function(req, res) {
   
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please pass username and password.'});
    } else {
        var newUser = new User({
            username: req.body.username,
            password: req.body.password
        });
        // save the user
        newUser.save(function(err) {
            if (err) {
                return res.json({success: false, msg: 'Username already exists.'});
            }
            res.json({success: true, msg: 'Successful created new user.'});
        });
    }
});

//Create router for login or sign-in.

router.post('/signin', function(req, res) {
  
    User.findOne({
        username: req.body.username
    }, function(err, user) {
        if (err) throw err;
      
        if (!user) {
            res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.sign(user.toJSON(), config.secret);
                
                    // return the information including token as JSON
                    res.json({_id:user._id,username:user.username, success: true, token: 'JWT ' + token});
                } else {
                    res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
});
getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

router.post('/email', function (req, res) {
    var email;
    email = new Email({
      sender: req.body.sender,
      receiver: req.body.receiver,
      subjects: req.body.subjects,
      email: req.body.email,
      status: 'unseen',
     
    });
    email.save(function (err) {
      if (!err) {
        return console.log("created");
      } else {
        return console.log(err);
      }
    });
    return res.send(email);
  });

router.get('/email/:username', (req, res, next) => {
    
    Email.find({'receiver':req.params.username}).sort({ createdAt: -1 }).exec((err, emails) => {
      if (err) return next(err);
      res.json(emails);
    });
  });
module.exports = router;