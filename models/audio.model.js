const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
    audioId: { type: Number, unique: true },
    title: { type: String, required: true },
    artist: { type: String, required: true },
    audioFile: { type: String, required: true },
    imageFile: { type: String }
}, { timestamps: true });

audioSchema.statics.getNextAudioId = async function() {
    try {
        const lastAudio = await this.findOne({}, {}, { sort: { 'audioId': -1 } });
        let nextAudioId = 1;
        if (lastAudio && lastAudio.audioId) {
            nextAudioId = lastAudio.audioId + 1;
        }
        return nextAudioId;
    }
    catch (error) {
        console.error('Error getting the next audioId:', error.message);
        throw error;
    }
};

audioSchema.pre('save', async function(next) {
    console.log('Pre-save middleware triggered');
    
    if (!this.audioId) {
        try {
            console.log('audioId is null, fetching next audioId');
            this.audioId = await this.constructor.getNextAudioId();
            console.log('Next audioId:', this.audioId);
        } catch (error) {
            console.error('Error getting next audioId:', error.message);
            throw error;
        }
    } 
    else {
        console.log('audioId already exists:', this.audioId);
    }
    
    next();
});

const Audio = mongoose.model('Audio', audioSchema);

module.exports = Audio;