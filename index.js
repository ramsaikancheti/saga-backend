const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');

const PORT = process.env.PORT || 3000;

const mongoDBAtlasIP = 'mongodb+srv://ram:ram123456789@cluster0.7k8qjfa.mongodb.net/';
mongoose.connect(`${mongoDBAtlasIP}ecomm` );

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 



app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


const userRoutes = require('./routes/user.route');
const productRoutes = require('./routes/products.route');
const bannerRoutes = require('./routes/banner.route');
const cartRoutes = require('./routes/cart.routes');
const categoryRoutes = require('./routes/category.route');
const PaymentController = require('./controllers/paymentcontroller');
const addressRoutes = require('./routes/address.route');
const orderRoutes = require('./routes/order.route');

app.use('/api', userRoutes);
app.use('/', productRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/', addressRoutes);
app.use('/', PaymentController);
app.use('/',  cartRoutes);
app.use('/', categoryRoutes);
app.use('/orders', orderRoutes); 
app.use('/api/products', productRoutes);
app.use('/api', productRoutes);

app.use('/styles', express.static(path.join(__dirname, 'styles'), {
    setHeaders: (res, path) => {
      if (path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      }
    },
}));

app.use(express.static('public'));
app.use('/styles', express.static(path.join(__dirname, 'styles'))); 
app.use('/public', express.static(path.join(__dirname, 'public'))); 
app.use('/images', express.static(path.join(__dirname, 'images')));


app.get('/', (req,  res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('registration');
});

app.get('/shoppix', (req,  res) => {
    res.render('shoppix');
});

app.get('/shoppix-dashboard', (req, res) => {
    res.render('index');
}); 

app.get('/dashboard', (req,  res) => {
    res.render('dashboard');
});

app.get('/productform', (req, res) => {
    res.render('productform');
}); 

app.get('/category', (req, res) => {
    res.render('category');
});

app.get('/orders', (req, res) => {
    res.render('orders');
});

app.get('/product', (req, res) => {
    res.render('products');
});

app.get('/customers', (req, res) => {
    res.render('customers');
});

app.get('/order', (req, res) => {
    res.render('order');
});

app.get('/admin', (req, res) => {
    res.render('admin-registration');
});
 
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;