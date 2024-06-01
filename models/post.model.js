const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postId: { type: Number, unique: true },
    content: { type: String, required: true },
    postTime: { type: Date, required: true },
}, { timestamps: true });

postSchema.statics.getNextPostId = async function() {
    try {
        const lastPost = await this.findOne({}, {}, { sort: { 'postId': -1 } });
        let nextPostId = 1;
        if (lastPost && lastPost.postId) {
            nextPostId = lastPost.postId + 1;
        }
        return nextPostId;
    } catch (error) {
        console.error('Error getting the next postId:', error.message);
        throw error;
    }
};

postSchema.pre('save', async function(next) {
    if (!this.postId) {
        this.postId = await this.constructor.getNextPostId();
    }
    next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
