const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

router.post('/api/addproduct', productController.addProduct);
router.get('/products', productController.getProducts);
router.get('/products/:productId', productController.getProductById);
router.get('/api/products/categories/:categoryId', productController.getProductsByCategory);
router.get('/api/products/categories/:categoryId/type/:typeId', productController.getProductsByCategoryAndType);
router.get('/sortby/cost/:order(ascending|descending)', productController.sortProductsByCost);

router.get('/products-page', productController.showProductForm);

router.put('/api/products/:productId', productController.updateProduct);
router.delete('/api/products/:productId', productController.deleteProduct);


module.exports = router;

