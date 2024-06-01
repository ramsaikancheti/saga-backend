const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const todoController = require('../controllers/todo.controller');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/todo/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});

router.post('/api/post/todo', upload.single('image'), todoController.createTodo);
router.get('/api/get/todo', todoController.getTodoData);
router.delete('/api/delete/todo/:todoId', todoController.deleteTodo);
module.exports = router;