const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signup', (req, res, next) => {
  User.find({ email: req.body.email, username: req.body.username })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'User already exists'
        })
      } else {
        bcrypt.hash(req.body.password, 12, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            })
          } else {
            const user = new User({

              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });

            user
              .save()
              .then(result => {
                return res.status(201).json({
                  message: 'User created'
                });
              })
              .catch(err => {
                res.status(500).json({
                  error: err
                })
              })
          }
        })
      }
    })
})

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Get on /orders'
  })
});

router.post('/', (req, res, next) => {
  const user = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    image: req.body.image,
    description: req.body.description
  }
  res.status(200).json({
    message: 'Post on /users',
    data: user
  })
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  res.status(200).json({
    message: req.params
  })

})

router.post('/login', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) return res.status(401).json({
        message: 'Auth failed'
      })

      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) return res.status(401)
        if (result) {
          const token = jwt.sign({
            email: user[0].email,
            userId: user[0].id,
            username: user[0].username
          }, process.env.JWT_KEY,
            {
              expiresIn: "1h"
            })
          return res.status(200).json({
            message: 'Auth successful'
          })
        }

        res.status(401).json({
          message: 'Auth failed'
        })
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
})

router.patch('/:id', (req, res, next) => {
  const id = req.params.id;

})

router.delete('/:id', (req, res, next) => {
  User.remove({ _id: req.params.id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'User deleted'
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
})

module.exports = router;