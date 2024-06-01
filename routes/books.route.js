const express = require('express');
const router = express.Router();
const bookController = require('../controllers/books.controllers');

router.post('/upload', bookController.uploadBook);
router.get('/get', bookController.getAllBooks);
router.get('/:bookId', bookController.getBookById);

module.exports = router;
