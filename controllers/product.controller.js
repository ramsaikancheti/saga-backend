const Product = require('../models/product.model');
const Category = require('../models/category.model');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const fileName = Date.now() + path.extname(file.originalname);
        cb(null, fileName);
    },
});

const uploadMiddleware = multer({ storage: storage }).array('images', 3);


const showProductForm = (req, res) => {
    try {
        res.render('productform.ejs'); 
    } catch (error) {
        console.error('Error showing product form:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const addProduct = async (req, res) => {
    try {
        uploadMiddleware(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ error: 'Multer error' });
            } else if (err) {
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            const { name, description, price, category, type, sizes, brandname } = req.body;

            if (!req.files || req.files.length < 2) {
                return res.status(400).json({ error: 'At least 2 images must be uploaded.' });
            }

            const images = req.files.map(file => "uploads/" + file.filename);
            const productId = await getNextProductId();
            const sizesArray = JSON.parse(sizes);

            const categoryDetails = await Category.findOne({ categoryId: Number(category) });

            if (!categoryDetails || categoryDetails.status === 0) {
                return res.status(404).json({ error: 'Category not found or out of stock' });
            }

            const typeDetails = categoryDetails.types.find(typeObj => typeObj.typesId === Number(type));

            if (!typeDetails) {
                return res.status(404).json({ error: 'Type not found in the category' });
            }

            if (typeDetails.status === 0) {
                return res.status(404).json({ error: 'Type is out of stock' });
            }

            const categoryInfo = {
                categoryId: categoryDetails.categoryId,
                name: categoryDetails.name,
                image: categoryDetails.image,
            };

            const typeInfo = {
                typesId: typeDetails.typesId,
                name: typeDetails.name,
                image: typeDetails.image,
            };

            const sizesArrayAsNumbers = sizesArray.map(sizeId => {
                const sizeInfo = typeDetails.sizes.find(size => size.sizeId === sizeId);
                if (sizeInfo) {
                    if (sizeInfo.status === 0) {
                        return null; 
                    }
                    return {
                        sizeId: sizeInfo.sizeId,
                        name: sizeInfo.name,
                        description: sizeInfo.description,
                        symbol: sizeInfo.symbol,
                    };
                } else {
                    return null;
                }
            });

            if (sizesArrayAsNumbers.some(size => size === null)) {
                return res.status(400).json({ error: 'One or more sizes are out of stock' });
            }

            const newProduct = new Product({
                productId,
                name,
                brandname,
                description,
                price,
                category: categoryInfo,
                type: typeInfo,
                sizes: sizesArrayAsNumbers,
                images,
            });

            await newProduct.save();
            res.status(201).json({ message: 'Product added successfully', product: newProduct });

        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
 
const getNextProductId = async () => {
    try {
        const highestProductId = await Product.findOne({}, { productId: 1 }).sort({ productId: -1 });
        return highestProductId ? highestProductId.productId + 1 : 1;
    } catch (error) {
        console.error('Error getting next product ID:', error);
        throw error;
    }
};

const getProductsByCategory = async (req, res) => {
    try {
        const categoryId = parseInt(req.params.categoryId);

        const products = await Product.find({ 'category.categoryId': categoryId });

        res.json({ products });
    } 
    catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ success: true, products });
    } 
    catch (error) {
        console.error('Error fetching all products:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}; 


const getProductById = async (req, res) => {
    const productId = req.params.productId;

    try {
        console.log('Received productId:', productId);

        const product = await Product.findOne({ productId: parseInt(productId) });

        if (!product) {
            console.log('Product not found');
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        console.log('Product found:', product);
        res.json({ success: true, product });
    } catch (error) {
        console.error('Error fetching product by ID:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const getProductsByCategoryAndType = async (req, res) => {
    try {
        const categoryId = parseInt(req.params.categoryId);
        const typeId = parseInt(req.params.typeId);

         const products = await Product.find({ category: categoryId, type: typeId });

        res.json({ products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const sortProductsByCost = async (req, res) => {
    const order = req.params.order;

    try {
        let sortDirection = 1;
        if (order === 'descending') {
            sortDirection = -1;
        } 
        else if (order !== 'ascending') {
            return res.status(400).json({ error: 'Invalid sorting order. Use "ascending" or "descending".' });
        }
        const sortedProducts = await Product.find().sort({ cost: sortDirection });
        res.setHeader('Content-Type', 'application/json');
        const formattedJson = JSON.stringify(sortedProducts, null, 2);
        res.send(formattedJson);
    } 
    catch (error) {
        console.error('Error sorting products by cost:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


const deleteProduct = async (req, res) => {
    const productId = req.params.productId;

    try {
        const deletedProduct = await Product.findOneAndDelete({ productId: productId });

        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.json({ success: true, message: 'Product deleted successfully', deletedProduct });
    } catch (error) {
        console.error('Error deleting product:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const updateProduct = async (req, res) => {
    const productId = req.params.productId;

    try {
        const updatedProduct = await Product.findOneAndUpdate(
            { productId: productId },
            { $set: req.body },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.json({ success: true, message: 'Product updated successfully', updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
module.exports = { addProduct, getProductsByCategory, getProductsByCategoryAndType, sortProductsByCost, getProducts, getProductById, showProductForm, deleteProduct, updateProduct };