const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');

router.post('/api/create/post', postController.createPost);
router.get('/api/get/post', postController.getPosts);

module.exports = router;
