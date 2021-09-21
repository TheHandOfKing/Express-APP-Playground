const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../models/post');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
  destination: function (req, file, sb) {
    cb(null, './uploads/posts/')
  },

  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
    cb(null, true);
  } else {
    cb(null, false)
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 12
  },
  fileFilter = fileFilter
});

router.get('/', (req, res, next) => {
  Post.find()
    .select('name body _id images')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        posts: docs.map(doc => {
          return {
            name: doc.name,
            body: doc.body,
            images: doc.images,
            _id: doc._id,
            request: {
              type: 'GET',
              url: `http://localhost:5000/posts/${doc._id}`
            }
          }
        })
      }

      res.status(200).json(response);
    })

    .catch(err => {
      console.log(err)
      res.status(500)
        .json({
          error: err
        })
    });
});

router.post('/', checkAuth, upload.single('images'), (req, res, next) => {
  //User request
  const post = new Post({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    body: req.body.body,
    createdAt: Date.now(),
    images: req.file.path,
    likes: 0,
    comments: [],
    author: req.body.authorId,
    location: req.body.location
  })
  //Validation

  //Send data
  post.save().then(result => {
    console.log(result)
    res.status(201).json({
      message: 'Post created',
      post: {
        name: post.name,
        body: post.body,
        images: doc.images,
        _id: post._id,
        request: {
          type: 'POST',
          url: `http://localhost:5000/posts/${post._id}`
        }
      }
    })
  })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        error: error
      })
    });
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  Post.findById(id)
    .select('name body images')
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200)
          .json({
            product: doc,
            request: {
              type: 'GET',
              url: `http://localhost:5000/posts/${doc._id}`
            }
          })
      } else {
        res.status(404).json({
          message: 'No valid entry for the Id'
        })
      }

    })
    .catch(error => {
      console.log(error)
      res.status(404).json({ error: error })
    })
})

router.patch('/:id', checkAuth, (req, res, next) => {
  const id = req.params.id;
  const updateOps = {};
  //works like this [{'propname': 'body', 'value': 'etc'}]
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value
  }
  Post.update({ _id: id }, {
    $set: updateOps
  })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Product Updated',
        request: {
          type: 'GET',
          url: `http://localhost:5000/posts/${id}`
        }
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
})

router.delete('/:id', checkAuth, (req, res, next) => {
  const id = req.params.id;
  Post.remove({
    _id: id
  }).exec()
    .then(result => {
      res.status(200).json({
        message: 'Post deleted',
        request: {
          type: 'Delete'
        }
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    });
})

module.exports = router;