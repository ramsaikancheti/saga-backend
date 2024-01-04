const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { Schema } = mongoose;
const { Types } = require('mongoose');

const Size = global.Size;
const app = express();
const PORT = process.env.PORT || 3000;
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const mongoDBAtlasIP = 'mongodb+srv://ram:ram123456789@cluster0.7k8qjfa.mongodb.net/';
mongoose.connect(`${mongoDBAtlasIP}ecomm`, {});

const userSchema = new mongoose.Schema({
    userId: { type: Number, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

async function getNextUserId() {
    try {
        const lastUser = await User.findOne({}, {}, { sort: { 'userId': -1 } });

        let nextUserId;

        if (lastUser && lastUser.userId) {
            nextUserId = lastUser.userId + 1;
        } else {
            nextUserId = 1;
        }
        return nextUserId;
    } catch (error) {
        console.error('Error getting next userId:', error.message);
        throw error;
    }
}

app.post('/register', async (req, res) => {
    const { name, email, password, role, phoneNumber } = req.body;

    try {
        const defaultRole = 'user';

        const selectedRole = role || defaultRole;  

        if (selectedRole === 'user') {
            const nextUserId = await getNextUserId();
            const newUser = new User({
                userId: nextUserId,
                name,
                email,
                password,
                phoneNumber,
            });
            await newUser.save();
            res.status(201).send({success:true, message:'User registration successful!'});
        } else if (selectedRole === 'admin') {
            const adminId = await getNextAdminId();
            const newAdmin = new Admin({
                adminId,
                name,
                email,
                password,
                phoneNumber,
            });
            await newAdmin.save();
            res.status(201).send({success:true, message:'Admin registration successful!'});
        }  
    } catch (error) {
     }
});


app.post('/login', async (req, res) => {
    const { identifier, password } = req.body;

    try {
        const isEmail = /\S+@\S+\.\S+/.test(identifier);
        const isPhoneNumber = /^\d{10}$/.test(identifier);

        if (!(isEmail || isPhoneNumber)) {
            return res.status(400).send('Invalid email or phone number format');
        }

        let user;

        if (isEmail) {
            user = await User.findOne({ email: identifier, password });
        } else if (isPhoneNumber) {
            user = await User.findOne({ phoneNumber: identifier, password });
        }

        if (user) {
            res.status(200).send({success: true, message:'Login successful!'});
        } else {
            res.status(401).send({success: false, message:'Login failed. Please check your credentials.'});
        }
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).send('Internal Server Error');
    }
});
 
const adminSchema = new mongoose.Schema({
    adminId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
});

const Admin = mongoose.model('Admin', adminSchema);

async function getNextAdminId() {
    try {
        const lastAdmin = await Admin.findOne({}, {}, { sort: { 'adminId': -1 } });

        let nextAdminId;

        if (lastAdmin && !isNaN(lastAdmin.adminId)) {
            nextAdminId = lastAdmin.adminId + 1;
        } else {
            nextAdminId = 1;
        }

        if (isNaN(nextAdminId)) {
            throw new Error('Invalid adminId');
        }

        return nextAdminId;
    } catch (error) {
        console.error('Error getting next adminId:', error.message);
        throw error;
    }
}



const categorySchema = new mongoose.Schema({
    categoryId: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String },
    types: [
        {
            typesId: { type: Number, required: true },
            name: { type: String, required: true },
            sizes: [
                {
                    sizeId: { type: Number, unique: true },
                    name: { type: String, required: true },
                    description: { type: String, required: true },
                    symbol: { type: String, required: true },
                },
            ],
            image: { type: String },
        },
    ],
});

const Category = mongoose.model('Category', categorySchema);

// app.post('/api/category', async (req, res) => {
//     try {
//         const highestCategoryId = await Category.findOne().sort({ categoryId: -1 }).limit(1);
//         const newCategoryId = highestCategoryId ? highestCategoryId.categoryId + 1 : 1;

//         const highestTypesId = await Category.aggregate([
//             { $unwind: '$types' },
//             { $sort: { 'types.typesId': -1 } },
//             { $limit: 1 },
//         ]);

//         const newTypesId = highestTypesId.length > 0 ? highestTypesId[0].types.typesId + 1 : 1;

//         const newCategory = new Category({
//             categoryId: newCategoryId,
//             name: req.body.name,
//             image: req.body.image,
//             types: req.body.types.map((type, index) => ({
//                 typesId: newTypesId + index,
//                 name: type.name,
//                 image: type.image,
//                 size: type.size, 
//             })),
//         });

//         const savedCategory = await newCategory.save();

//         res.json({ success: true, message: 'Category saved' });
//     } catch (error) {
//         res.status(500).json({ success: false, message: `Error: ${error.message}` });
//     }
// });


app.post('/api/category', async (req, res) => {
    try {
        const highestCategoryId = await Category.findOne().sort({ categoryId: -1 }).limit(1);
        const newCategoryId = highestCategoryId ? highestCategoryId.categoryId + 1 : 1;

        const highestTypesId = await Category.aggregate([
            { $unwind: '$types' },
            { $sort: { 'types.typesId': -1 } },
            { $limit: 1 },
        ]);

        const newTypesId = highestTypesId.length > 0 ? highestTypesId[0].types.typesId + 1 : 1;

        const newCategory = new Category({
            categoryId: newCategoryId,
            name: req.body.name,
            image: req.body.image,
            types: req.body.types.map((type, index) => {
                const sizes = type.sizes.map((size, sizeIndex) => ({
                    sizeId: index * type.sizes.length + sizeIndex + 1,
                    name: size.name,
                    description: size.description,
                    symbol: size.symbol,
                }));

                return {
                    typesId: newTypesId + index,
                    name: type.name,
                    image: type.image,
                    sizes: sizes,
                };
            }),
        });

        const savedCategory = await newCategory.save();

        res.json({ success: true, message: 'Category saved' });
    } catch (error) {
        res.status(500).json({ success: false, message: `Error: ${error.message}` });
    }
});



app.get('/api/categories/:categoryId?/:typesId?', async (req, res) => {
    try {
        let query = {};

        if (req.params.categoryId) {
            query.categoryId = parseInt(req.params.categoryId);
        }

        if (req.params.typesId) {
            query['types.typesId'] = parseInt(req.params.typesId);
        }

        if (!req.params.categoryId) {
            const allCategories = await Category.find();
            return res.json(allCategories);
        }

        const category = await Category.findOne(query);

        if (!category) {
            return res.status(404).json({ error: 'Category or Type not found' });
        }

        if (req.params.categoryId && req.params.typesId) {
            const matchingType = category.types.find((type) => type.typesId === parseInt(req.params.typesId));

            if (matchingType) {
                 category.types = [matchingType];
                res.json(category);
            } else {
                res.status(404).json({ error: 'Type not found in the specified category' });
            }
        } else {
             const categoriesWithSize = category.toObject(); 
            categoriesWithSize.types.forEach((type) => {
                 type.size = type.size || [];
            });
            res.json(categoriesWithSize);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.put('/updateCategory/:categoryId', async (req, res) => {
    try {
        const categoryId = req.params.categoryId;

         const updatedCategory = {
            name: req.body.name,
            image: req.body.image,
            types: req.body.types.map(type => ({
                name: type.name,
                size: type.size || null,  
                image: type.image,
            })),
             newField: req.body.newField,
        };

        const result = await Category.findOneAndUpdate(
            { categoryId: categoryId },
            { $set: updatedCategory },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json({ message: 'Category updated successfully', category: result });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});
 

  

const productSchema = new mongoose.Schema({
    productId: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    brandname: {
        type: String, 
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: Number,
        ref: 'Category',
        required: true,
    },
    type: {
        type: Number,
        ref: 'Type',
        required: true,
    },
    sizes: {
        type: [Number],
        ref: 'Size',
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    images: {
        type: [String],
        required: true,
    },
});

const Product = mongoose.model('Product', productSchema);

const storageMiddleware = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname;
        cb(null, fileName);
    },
});

const uploadMiddleware = multer({ storage: storageMiddleware }).array('images', 3);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/addproduct', uploadMiddleware, async (req, res) => {
    try {
        const { name, description, price, category, type, sizes, brandname } = req.body;

        if (!req.files || req.files.length < 2) {
            return res.status(400).json({ error: 'At least 2 images must be uploaded.' });
        }

        const images = req.files.map(file => "uploads/" + file.originalname);

        const productId = await getNextProductId();

        const sizesArray = JSON.parse(sizes);

        const newProduct = new Product({
            productId,
            name,
            brandname,
            description,
            price,
            category: Number(category),
            type: Number(type),
            sizes: sizesArray,
            images,
              
        });

        await newProduct.save();

        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function getNextProductId() {
    try {
        const highestProductId = await Product.findOne({}, { productId: 1 }).sort({ productId: -1 });
        return highestProductId ? highestProductId.productId + 1 : 1;
    } catch (error) {
        console.error('Error getting next product ID:', error);
        throw error;
    }
}

 
app.get('/api/products/categories/:categoryId', async (req, res) => {
    try {
        const categoryId = parseInt(req.params.categoryId);

         const products = await Product.find({ category: categoryId });

        res.json({ products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/api/products/categories/:categoryId/type/:typeId', async (req, res) => {
    try {
        const categoryId = parseInt(req.params.categoryId);
        const typeId = parseInt(req.params.typeId);

         const products = await Product.find({ category: categoryId, type: typeId });

        res.json({ products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// app.get('/api/products/categories/:categoryId/type/:typeId/size/:sizeId', async (req, res) => {
//     try {
//         const categoryId = parseInt(req.params.categoryId);
//         const typeId = parseInt(req.params.typeId);
//         const sizeId = parseInt(req.params.sizeId);

//          const products = await Product.find({ category: categoryId, type: typeId, size: sizeId });

//         res.json({ products });
//     } catch (error) {
//         console.error('Error fetching products:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });
 


const sizeSchema = new mongoose.Schema({
    sizeId: { type: Number, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    symbol: { type: String, required: true },
  });

  
  const Sizes = mongoose.model('Sizes', sizeSchema);
  
  module.exports = Sizes;

  app.post('/api/sizes', async (req, res) => {
    try {
      const { name, description, symbol } = req.body;
  
      if (!name || !description || !symbol) {
        return res.status(400).json({ error: 'Name, description, and symbol are required.' });
      }
  
      const newSize = new Sizes({
        name,
        description,
        symbol,
      });
  
      const savedSize = await newSize.save();
  
      res.status(201).json({ message: 'Size added successfully', size: savedSize });
    } catch (error) {
      console.error('Error adding size:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });








 

module.exports = Product;

const cartSchema = new Schema({
    cartId: { type: Number, unique: true },
    userId: { type: Number, required: true, unique: true },
    products: [{
        productId: { type: Number, required: true },
        name: { type: String, required: true },
        brandname: { type: String }, 
        description: { type: String, required: true },
        category: { type: Number, ref: 'Category', required: true },
        type: { type: Number, ref: 'Type', required: true },
        sizes: { type: [Number], ref: 'Size', required: true },
        price: { type: Number, required: true },
        images: { type: [String], required: true },
        quantity: { type: Number, default: 1 },
    }],
});

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);


const addressSchema = new mongoose.Schema({
    userId: { type: Number, required: true },
    addressId: { type: Number, required: true },
    hNo: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
});

const Address = mongoose.model('Address', addressSchema);
module.exports = Address;

const paymentSchema = new mongoose.Schema({
    paymentId: { type: Number, unique: true },
    name: { type: String, required: true },
    image: { type: String },
});

const Payment = mongoose.model('Payment', paymentSchema);


const paymentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'payment-uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const orderSchema = new mongoose.Schema(
    {
        orderId: String,
        userId: Number,
        couponCode: String,
        discount: Number,
        totalAmount: Number,
        paymentMethod: String,
        address: {
            addressId: Number,
            hNo: String,
            area: String,
            city: String,
            state: String,
            pincode: String,
        },
        addressId: { type: Number, required: true },
        products: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
                quantity: Number,
            },
        ],
    },
    { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
 
const paymentUpload = multer({ storage: paymentStorage });  
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/product', (req, res) => {
    res.sendFile(path.join(__dirname, 'product.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html');
});

app.get('/ordersdetails', (req, res) => {
    res.sendFile(path.join(__dirname, 'orderdetails.html'));
});

 
app.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    console.log('Requested Image Path:', filename);
    res.sendFile(path.join(__dirname, 'uploads', filename));
});

const typeSchema = new mongoose.Schema({
     typeName: { type: String, required: true },
     typesId : { type : Number, required : true}
});

const Type = mongoose.model('Type', typeSchema);

module.exports = Type;





 

const categoryMap = {
    1: 'Men',
    2: 'Women',
    3: 'Pets',
};

const typeMap = {
    1: { 1: 'Shirts', 2: 'Pants', 3: 'Shorts', 4: 'Shoes', 5: 'Watches' },
    2: { 1: 'Toys', 2: 'Treats' },
};
 
const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 1 }
});

const Counter = mongoose.model('Counter', counterSchema);

async function getNextBannerId() {
    const maxBannerId = await Banner.findOne({}).sort({ bannerId: -1 });

    const nextId = maxBannerId ? maxBannerId.bannerId + 1 : 1;

    return nextId;
}

const bannerSchema = new mongoose.Schema({
    bannerId: { type: Number, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String }, 
    image: { type: String, required: true },
 });

const Banner = mongoose.model('Banner', bannerSchema);


// app.post('/addBanner', upload.single('image'), async (req, res) => {
//     const { name, category, type, tag } = req.body;
//     const image = '/uploads/' + req.file.originalname;

//     try {
//         const bannerId = await getNextBannerId();
//         const newBanner = new Banner({
//             bannerId,
//             name,
//             category: categoryMap[category],  
//             type: typeMap[category][type],   
//             image,
//             tag,
//         });

//         await newBanner.save();
//         res.send('Banner added successfully!');
//     } catch (error) {
//         if (error.code === 11000 && error.keyPattern.bannerId) {
//             console.error('Duplicate bannerId:', error.message);
//             res.status(400).send('Banner with the same ID already exists.');
//         } else {
//             console.error('Error saving banner:', error.message);
//             res.status(500).send('Internal Server Error');
//         }
//     }
// });


app.post('/addBanner', upload.single('image'), async (req, res) => {
    const { name, category, type } = req.body;
    const image = '/uploads/' + req.file.originalname;
  
     const categoryAsNumber = parseInt(category);
    const typeAsNumber = parseInt(type);
  
    try {
      const bannerId = await getNextBannerId();
      const newBanner = new Banner({
        bannerId,
        name,
        category: isNaN(categoryAsNumber) ? category : categoryAsNumber,
        type: isNaN(typeAsNumber) ? type : typeAsNumber,
        image,
       });
  
      await newBanner.save();
      res.send({success: true,message: 'Banner added successfully!'});
    } catch (error) {
      if (error.code === 11000 && error.keyPattern.bannerId) {
        console.error({success: false,message: 'Duplicate bannerId:'});
        res.status(400).send({message:'Banner with the same ID already exists.'});
      } else {
        console.error('Error saving banner:', error.message);
        res.status(500).send({success: false, message:'Internal Server Error'});
      }
    }
  }); 


 
app.get('/getAllBanners', async (req, res) => {
    try {
      const banners = await Banner.find({}, { _id: 0, __v: 0 });
      res.json({ success: true, banners });
    } catch (error) {
      console.error('Error fetching banners:', error.message);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
 

app.get('/getProduct/:id?', async (req, res) => {
    try {
        if (req.params.id) {
            const productId = req.params.id;
            const product = await Product.findOne({ productId });
            if (!product) {
                return res.status(404).send('Product not found');
            }
            res.json(product);
        } else {
            const allProducts = await Product.find();
            res.json(allProducts);
        }
    } catch (error) {
        console.error('Error fetching products:', error.message);
         res.status(500).json({ success: false, message: 'Internal Server Error', messageType: 'error' });

    }
});

app.get('/sortby/cost/:order(ascending|descending)', async (req, res) => {
    const order = req.params.order;

    try {
        let sortDirection = 1;

        if (order === 'descending') {
            sortDirection = -1;
        } else if (order !== 'ascending') {
            return res.status(400).json({ error: 'Invalid sorting order. Use "ascending" or "descending".' });
        }

        const sortedProducts = await Product.find().sort({ cost: sortDirection });

         res.setHeader('Content-Type', 'application/json');

         const formattedJson = JSON.stringify(sortedProducts, null, 2);

        res.send(formattedJson);
    } catch (error) {
        console.error('Error sorting products by cost:', error.message);
        res.status(500).json({success:false, message: 'Internal Server Error' });
    }
}); 



const findAndIncrementCartId = async () => {
    const highestCart = await Cart.findOne().sort({ cartId: -1 });
    const nextCartId = highestCart ? highestCart.cartId + 1 : 1;
    return nextCartId;
  };

   
  app.post('/addToCart', async (req, res) => {
    try {
        const { userId, quantity = 1, productId } = req.body;

        if (!productId) {
            return res.status(400).json({ success: false, message: 'ProductId is required' });
        }

        const productDetails = await Product.findOne({ productId });

        if (!productDetails) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            const nextCartId = await findAndIncrementCartId();

            cart = new Cart({
                userId,
                cartId: nextCartId,
                products: [{
                    ...productDetails.toObject(),
                    productId,
                    quantity,
                }],
            });
        } else {
            const existingProductIndex = cart.products.findIndex(product => product.productId === productId);

            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                cart.products.push({
                    ...productDetails.toObject(),
                    productId,
                    quantity,
                });
            }
        }

        const validationError = cart.validateSync();

        if (validationError && validationError.errors['products.0']) {
            const invalidProductIndex = parseInt(validationError.errors['products.0'].path.split('.')[1], 10);
            cart.products.splice(invalidProductIndex, 1);
        }

        await cart.save();

         res.json({
            success: true,
            message: 'Product added to cart successfully',
            cartId: cart.cartId,
            userId: cart.userId,
            products: cart.products,
        });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});





  
app.get('/api/getcart', async (req, res) => {
    try {
        const carts = await Cart.find();
        res.json({ success: true, carts });
    } catch (error) {
        console.error('Error fetching carts:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.get('/api/getcart/:cartId', async (req, res) => {
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
});


app.get('/getCart/userId/:userId', async (req, res) => {
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
});

app.get('/getSettings', (req, res) => {

    const categories = {
        1: 'mens',
        2: 'womens',
        3: 'pets',
     };

    const types = {
        1: 'Shirts',
        2: 'Pants',
        3: 'Shorts',
        4: 'Shoes',
        5: 'Watches',
     };

     const pettypes = {
        1: 'Toys',
        2: 'Treats',
     }

     const sizes = {
        1: 'sm',
        2: 'md',
        3: 'lg',
        4: 'xl',
        5: 'xxl',
     };

     const shoesizes = {
        1: '9',
        2: '10',
        3: '11', 
     };

    const settings = {
        
        categories,
        types,
        pettypes,
        sizes,
        shoesizes
    };

    res.json(settings);
});


 
const getNextAddressId = async () => {
    const latestAddress = await Address.findOne().sort({ addressId: -1 });
    return latestAddress ? latestAddress.addressId + 1 : 1;
};

app.post('/addAddress/:userId', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const { hNo, area, city, state, pincode } = req.body;

        if (!hNo || !area || !city || !state || !pincode) {
            return res.status(400).json({ success: false, message: 'All address fields are required' });
        }

        const nextAddressId = await getNextAddressId();

        const newAddress = new Address({
            userId, 
            addressId: nextAddressId,
            hNo,
            area,
            city,
            state,
            pincode,
        });

        await newAddress.validate(); 

        await newAddress.save();

        res.json({ success: true, message: 'Address added successfully!', addressId: newAddress.addressId });

    } catch (error) {
        console.error('Error adding address:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.get('/getUserAddress/:userId', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);

         const userExists = await User.exists({ userId });

        if (!userExists) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

         const user = await User.findOne({ userId }, 'userId name email');

         const addresses = await Address.find({ userId }, 'addressId hNo area city state pincode');

        let userCart;

         if (req.params.cart === 'cart') {
            userCart = await Cart.findOne({ userId });
        }

         const userWithAddress = {
            user: user.toObject(),
            addresses: addresses.map(address => address.toObject()),
            cart: userCart ? userCart.products.map(product => product.toObject()) : undefined
        };

        res.json({ success: true, userWithAddress });
    } catch (error) {
        console.error('Error fetching user and address details:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.use('/payment-uploads', express.static(path.join(__dirname, 'payment-uploads')));

app.post('/addPayment', paymentUpload.single('image'), async (req, res) => {
    console.log('Request Body:', req.body);
    console.log('Request File:', req.file);

    const { name } = req.body;

    try {
        let image;

        if (req.file) {
            image = '/payment-uploads/' + req.file.originalname;
        } else {
            image = '/default-payment-image.jpg';
        }

         const newPayment = new Payment({
            name,
            image,
        });

        await newPayment.save();
        res.send('Payment added successfully!');
    } catch (error) {
        console.error('Error saving payment:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/paymentmethods', async (req, res) => {
    try {
         const paymentMethods = await Payment.find({}, { _id: 0, name: 1, image: 1 });

         const formattedPaymentMethods = paymentMethods.map(method => ({
            id: method._id, 
            name: method.name,
            image: method.image,
        }));

         res.json(formattedPaymentMethods);
    } catch (error) {
        console.error('Error fetching payment methods:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
 
app.get('/getUserAddress/:userId/:cart?', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);

         const userExists = await User.exists({ userId });

        if (!userExists) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

         const user = await User.findOne({ userId }, 'userId name email');

         const addresses = await Address.find({ userId }, 'addressId hNo area city state pincode');

        let userCart;

         if (req.params.cart === 'cart') {
            userCart = await Cart.findOne({ userId });
        }

         const userWithAddress = {
            user: user.toObject(),
            addresses: addresses.map(address => address.toObject()),
            cart: userCart ? userCart.products.map(product => product.toObject()) : undefined
        };

        res.json({ success: true, userWithAddress });
    } catch (error) {
        console.error('Error fetching user and address details:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


app.post('/place-order/:userId', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const { couponCode, discount, paymentMethod, addressId } = req.body;

        const userCart = await Cart.findOne({ userId });

        if (!userCart || userCart.products.length === 0) {
            return res.status(400).json({ success: false, message: 'User cart is empty. Add products to the cart before placing an order.' });
        }

        const shippingCost = calculateShippingCost(userCart.products);
        const totalAmount = calculateTotalAmount(userCart.products, discount) + shippingCost;
        const orderId = generateRandomOrderId();

        const addressDetails = await Address.findOne({ userId, addressId });

        if (!addressDetails) {
            return res.status(404).json({ success: false, message: 'Address not found for the given addressId.' });
        }

        const newOrder = new Order({
            orderId,
            userId,
            couponCode,
            discount,
            totalAmount,
            paymentMethod: getPaymentMethodName(paymentMethod),
            address: {
                hNo: addressDetails.hNo,
                area: addressDetails.area,
                city: addressDetails.city,
                state: addressDetails.state,
                pincode: addressDetails.pincode,
            },
            shippingCost,  
        });

        await newOrder.save();

        userCart.products = [];
        await userCart.save();

        res.json({ success: true, message: 'Order placed successfully!', orderId });
    } catch (error) {
        console.error('Error placing order:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

    function calculateTotalAmount(products, discount) {
        const subtotal = products.reduce((total, product) => total + product.cost * product.quantity, 0);
        return subtotal - (subtotal * discount) / 100;
    }

    function calculateShippingCost(products) {
         const fixedShippingCost = 50; 
        return fixedShippingCost;
    }

    function generateRandomOrderId() {
        return uuidv4().substr(0, 6).toUpperCase();
    }

    function getPaymentMethodName(paymentMethodNumber) {
        const paymentMethodMap = {
            1: 'netbanking',
            2: 'credit card',
            3: 'debit card',
            4: 'cash on delivery',
        };
        return paymentMethodMap[paymentMethodNumber] || 'unknown';
    }
});
 

app.get('/api/products', async (req, res) => {
    try {
      const allProducts = await Product.find();
      res.json(allProducts);
    } catch (error) {
      console.error('Error fetching products:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'products.html'));
});
 

app.put('/api/products/:id', async (req, res) => {
    const productId = req.params.id;
    const updatedProduct = req.body;

    try {
         await db.updateProduct(productId, updatedProduct);

        res.json({ message: `Product with ID ${productId} updated successfully`, updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.delete('/api/products/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const deletedProduct = await Product.findOneAndDelete({ _id: productId });  

        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


  

const db = {
    async deleteProduct(productId) {
        console.log('Deleting product with ID:', productId);

        if (isNaN(productId)) {
            throw new Error('Invalid productId');
        }

        try {
            const result = await Product.deleteOne({ _id: productId });
            console.log('Delete result:', result);

            if (result.deletedCount === 0) {
                throw new Error('Product not found or not deleted');
            }

            console.log('Product deleted successfully.');
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error; 
        }
    },
};
 

app.get('/all-orders', async (req, res) => {
    try {
        const orders = await Order.find();
        console.log('Fetched Orders:', orders);
        res.render('all-orders', { orders });
    } catch (error) {
        console.error('Error fetching all orders:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
 
function getPaymentMethodName(paymentMethodNumber) {
    const paymentMethodMap = {
        'netbanking': 'Netbanking',
        'credit card': 'Credit Card',
        'debit card': 'Debit Card',
        'cash on delivery': 'Cash on Delivery',
    };
    return paymentMethodMap[paymentMethodNumber] || 'Unknown';
}

 
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

async function getNextProductId() {
    const lastProduct = await Product.findOne({}, {}, { sort: { 'productId': -1 } });
    return lastProduct ? lastProduct.productId + 1 : 1;
}

async function getNextUserId() {
    const lastUser = await User.findOne({}, {}, { sort: { 'userId': -1 } });
    return lastUser ? lastUser.userId + 1 : 1;
}
