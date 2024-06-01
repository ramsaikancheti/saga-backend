const multer = require('multer');
const Book = require('../models/books.model');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/books/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const uploadBook = (req, res) => {
    upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'epub', maxCount: 1 }
    ])(req, res, async function (err) {
        if (err) {
            console.error('Error uploading book:', err);
            return res.status(500).json({ success: false, message: 'Error uploading book' });
        }

        try {
            const { title, category, author } = req.body;
            const imageFile = req.files['image'] ? req.files['image'][0] : undefined;
            const epubFile = req.files['epub'] ? req.files['epub'][0] : undefined;

            if (!imageFile) {
                return res.status(400).json({ success: false, message: 'Image file is required' });
            }

            const image = imageFile.path;
            let epub = null;
            if (epubFile) {
                epub = epubFile.path;
            }

            const newBook = new Book({
                title,
                author,
                category,
                image,
                epub  
            });

            await newBook.save();

            res.status(201).json({ success: true, message: 'Book uploaded successfully' });
        } catch (error) {
            console.error('Error saving book:', error.message);
            res.status(500).json({ success: false, message: 'Error saving book' });
        }
    });
};  

const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find({});
        res.status(200).json({ success: true, books });
    } catch (error) {
        console.error('Error fetching books:', error.message);
        res.status(500).json({ success: false, message: 'Error fetching books' });
    }
};

const getBookById = async (req, res) => {
    const { bookId } = req.params;
    try {
        const book = await Book.findOne({ bookId });
        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }
        res.status(200).json({ success: true, book });
    } catch (error) {
        console.error('Error fetching book by ID:', error.message);
        res.status(500).json({ success: false, message: 'Error fetching book' });
    }
};

module.exports = {uploadBook, getAllBooks, getBookById};