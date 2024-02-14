const express = require('express');
const app = express();
const categoryController = require('../controllers/category.controller');

app.post('/api/category', categoryController.addCategory);
app.get('/api/categories/:categoryId?/:typesId?', categoryController.getCategories);
app.get('/api/types/:typesId', categoryController.getTypesById);

app.put('/updateCategory/:categoryId', categoryController.updateCategory);
app.put('/api/updatetypes/:typesId', categoryController.updateTypes);
 
app.put('/api/status/category/:categoryId', categoryController.updateStatus);
app.put('/api/status/category/:categoryId/types/:typesId', categoryController.updateTypeStatus);
app.put('/api/status/category/:categoryId/types/:typesId/sizes/:sizeId', categoryController.updateSizeStatus);

app.put('/api/status/types/:typesId', categoryController.updateTypeStatusId);

app.delete('/api/delete/category/:categoryId', categoryController.deleteCategory);
app.delete('/api/delete/category/:categoryId/types/:typesId', categoryController.deleteType);

app.delete('/api/delete/types/:typesId', categoryController.deleteTypeById);


module.exports = app;