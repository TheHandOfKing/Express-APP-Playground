const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Comment = require('../models/comment');
const Post = require('../models/post');
//A potential database overflow present (too many comments to load, so either scrap, give to admin or use pagination)
router.get('/', checkAuth, (req, res, next) => {
  // let pageNumber = 0;
  // let pageSize = 10;
  Comment
    .find()
    .select('body _id')
    // .populate('author comments postId', 'name') -> this is how u populate a referential query 
    // .skip((pageNumber - 1) * pageSize)
    // .limit(pageSize)
    // .sort({ name: 1 })
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        comments: docs.map(doc => {
          return {
            _id: doc._id,
            body: doc.body,
            request: {
              type: 'GET',
              url: 'http://localhost:5000/comments' + doc._id
            }
          }
        }),
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
})

router.post('/', checkAuth, (req, res, next) => {
  if (req.body.postId) {
    Post.findById(req.body.postId)
      .then(post => {
        if (!post) {
          return res.status(404).json({
            message: 'Not found'
          })
        }
        const comment = new Comment({
          _id: mongoose.Types.ObjectId(),
          body: req.body.body,
          post: req.body.postId,
        });
        return comment.save()
          .exec()
          .then(result => {
            console.log(result)
            res.status(201).json({
              message: 'Comment on post created',
              createdComment: {
                id: result._id,
                body: result.body,
                comment: result.comment
              },
              request: {
                type: 'GET',
                url: 'http://localhost:5000/comments' + result._id
              }
            });
          })
          .catch(err => {
            console.log(err)
            res.status(500).json({
              error: err
            })
          })
      })
      .catch(err => {
        res.status(500).json({
          message: 'Post not found',
          error: err
        })
      })
  } else if (req.body.commentId) {
    Comment.findById(req.body.commentId)
      .then(comment => {
        if (!comment) {
          return res.status(404).json({
            message: 'Comment not found'
          })
        }
        const comment = new Comment({
          _id: mongoose.Types.ObjectId(),
          body: req.body.body,
          comment: req.body.commentId,
        });
        return comment.save()
          .exec()
          .then(result => {
            console.log(result)
            res.status(201).json({
              message: 'Comment on comment created',
              createdComment: {
                id: result._id,
                body: result.body,
                comment: result.comment
              },
              request: {
                type: 'GET',
                url: 'http://localhost:5000/comments' + result._id
              }
            });
          })
          .catch(err => {
            console.log(err)
            res.status(500).json({
              error: err
            })
          })
      })
      .catch(err => {
        res.status(500).json({
          message: 'Post not found',
          error: err
        })
      })
  }
})

router.get('/:commentId', checkAuth, (req, res, next) => {
  Comment.findById(req.params.commentId)
    .exec()
    .then(comment => {
      if (!comment) {
        return res.status(404).json({
          message: 'Comment not found'
        })
      }
      res.status(200).json({
        comment: comment,
        request: {
          type: 'GET',
          url: 'http://localhost/comments'
        }
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    })
})

router.delete('/:commentId', checkAuth, (req, res, next) => {
  Comment.remove({ _id: req.params.id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Comment deleted',
        rquest: {
          type: 'Delete'
        }
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    });
})