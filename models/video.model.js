const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    videoId: { type: Number, unique: true },
    title: { type: String, required: true },
    videoFile: { type: String, required: true },
}, 
{ timestamps: true });

videoSchema.statics.getNextVideoId = async function() {
    try {
        const lastVideo = await this.findOne({}, {}, { sort: { 'videoId': -1 } });
        let nextVideoId = 1;
        if (lastVideo && lastVideo.videoId) {
            nextVideoId = lastVideo.videoId + 1;
        }
        return nextVideoId;
    } catch (error) {
        console.error('Error getting the next videoId:', error.message);
        throw error;
    }
};

videoSchema.pre('save', async function(next) {
    if (!this.videoId) {
        this.videoId = await this.constructor.getNextVideoId();
    }
    next();
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;