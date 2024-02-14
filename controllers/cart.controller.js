const mongoose = require('mongoose');
const { Cart, findAndIncrementCartId } = require('../models/cart.model');
const Product = require('../models/product.model');

const addToCart = async (req, res) => {
    try {
        const { userId, quantity = 1, productId } = req.body;

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ success: false, message: 'Invalid productId' });
        }

        const productDetails = await Product.findOne({ productId });

        if (!productDetails) {
            console.log('Product not found');
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            const nextCartId = await findAndIncrementCartId();

            const cartProduct = {
                productId: productDetails.productId,
                name: productDetails.name,
                brandname: productDetails.brandname,
                description: productDetails.description,
                price: productDetails.price,
                category: {
                    categoryId: productDetails.category.categoryId,
                    name: productDetails.category.name,
                    image: productDetails.category.image,
                },
                type: productDetails.type ? {
                    typesId: productDetails.type.typesId,
                    name: productDetails.type.name,
                    image: productDetails.type.image,
                } : null,
                sizes: productDetails.sizes.map(size => ({
                    sizeId: size.sizeId,
                    name: size.name,
                    description: size.description,
                    symbol: size.symbol,
                })),
                images: productDetails.images,
                quantity: Number(quantity),
            };

            cart = new Cart({
                userId,
                cartId: nextCartId,
                products: [cartProduct],
            });

             await cart.save();
        } else {
             await Cart.updateOne(
                { userId },
                {
                    $addToSet: {
                        products: {
                            productId: productDetails.productId,
                            name: productDetails.name,
                            brandname: productDetails.brandname,
                            description: productDetails.description,
                            price: productDetails.price,
                            category: {
                                categoryId: productDetails.category.categoryId,
                                name: productDetails.category.name,
                                image: productDetails.category.image,
                            },
                            type: productDetails.type ? {
                                typesId: productDetails.type.typesId,
                                name: productDetails.type.name,
                                image: productDetails.type.image,
                            } : null,
                            sizes: productDetails.sizes.map(size => ({
                                sizeId: size.sizeId,
                                name: size.name,
                                description: size.description,
                                symbol: size.symbol,
                            })),
                            images: productDetails.images,
                            quantity: Number(quantity),
                        },
                    },
                }
            );
        }

         const updatedCart = await Cart.findOne({ userId });

        res.json({
            success: true,
            message: 'Product added to cart successfully',
            cartId: updatedCart.cartId,
            userId: updatedCart.userId,
            products: updatedCart.products,
        });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};




const getAllCarts = async (req, res) => {
    try {
        const carts = await Cart.find();
        res.json({ success: true, carts });
    } catch (error) {
        console.error('Error fetching carts:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const getCartById = async (req, res) => {
    try {
        const { cartId } = req.params;
        const cart = await Cart.findOne({ cartId });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        res.json({ success: true, cart });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const getUserCart = async (req, res) => {
    try {
        const userId = req.params.userId;

        const userCart = await Cart.findOne({ userId });

        if (!userCart) {
            return res.status(404).json({ success: false, message: 'Cart not found for the user.' });
        }

        res.json(userCart.products);
    } catch (error) {
        console.error('Error fetching user cart:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// const getAllCarts = async (req, res) => {
//     try {
//         const carts = await Cart.find();
//         res.json({ success: true, carts });
//     } catch (error) {
//         console.error('Error fetching carts:', error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// };

module.exports = { addToCart, getAllCarts, getCartById, getUserCart };

