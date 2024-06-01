const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');

const PORT = process.env.PORT || 4000;

const mongoDBAtlasIP = 'mongodb+srv://ram:ram123456789@cluster0.7k8qjfa.mongodb.net/';
mongoose.connect(`${mongoDBAtlasIP}saga`);

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:5177',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

const userRoutes = require('./routes/user.route');
const galleryRoutes = require('./routes/gallery.route');
const routes = require('./routes/books.route');
const todoRoutes = require('./routes/todo.route');
const safeRoutes = require('./routes/safe.route');
const audioRoutes = require('./routes/audio.route');
const videoRoutes = require('./routes/video.route');
const bookRoutes = require('./routes/books.route');
const postRoutes = require('./routes/post.route');
const addToFavourites = require('./routes/favourite.route');

app.use('/api', userRoutes);
app.use('/', galleryRoutes);
app.use('/', routes);
app.use('/', todoRoutes);
app.use('/safe', safeRoutes);
app.use('/audio', audioRoutes);
app.use('/video', videoRoutes);
app.use('/book', bookRoutes);
app.use('/', postRoutes);
app.use('/', addToFavourites);


app.use('/styles', express.static(path.join(__dirname, 'styles'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  },
}));

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;