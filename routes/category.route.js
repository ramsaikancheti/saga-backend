const express = require('express');
const app = express();
const categoryController = require('../controllers/category.controller');

app.post('/api/category', categoryController.addCategory);
app.get('/api/categories/:categoryId?/:typesId?', categoryController.getCategories);
app.put('/updateCategory/:categoryId', categoryController.updateCategory);

module.exports = app;