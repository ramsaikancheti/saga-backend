const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    bookId: { type: Number, unique: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    epub: { type: String}
}, { timestamps: true });

bookSchema.statics.getNextBookId = async function() {
    try {
        const lastBook = await this.findOne({}, {}, { sort: { 'bookId': -1 } });
        let nextBookId = 1;
        if (lastBook && lastBook.bookId) {
            nextBookId = lastBook.bookId + 1;
        }
        return nextBookId;
    } catch (error) {
        console.error('Error getting the next bookId:', error.message);
        throw error;
    }
};

bookSchema.pre('save', async function(next) {
    if (!this.bookId) {
        this.bookId = await this.constructor.getNextBookId();
    }
    next();
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
