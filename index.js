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

const userRoutes = require('./routes/user.route');
const productRoutes = require('./routes/products.route');
const bannerRoutes = require('./routes/banner.route');
const cartRoutes = require('./routes/cart.routes');
const categoryRoutes = require('./routes/category.route');
const PaymentController = require('./controllers/paymentcontroller');
const addressRoutes = require('./routes/address.route');
const orderRoutes = require('./routes/order.route');

app.use('/user', userRoutes);
app.use('/login', userRoutes);
app.use('/', productRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/', addressRoutes);
app.use('/', PaymentController);
app.use('/',  cartRoutes);
app.use('/', categoryRoutes);
app.use('/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api', productRoutes);
 
app.get('/', (req, res) => {
    res.render('index');
}); 

app.get('/product', (req, res) => {
    res.render('productform');
}); 

app.get('/login', (req,  res) => {
    res.render('login');
}); 

app.get('/register', (req, res) => {
    res.render('registration');
}); 

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;