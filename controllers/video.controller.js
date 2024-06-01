const multer = require('multer');
const Video = require('../models/video.model');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/videos/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

const upload = multer({ storage: storage }).single('videoFile');

const uploadVideo = (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            console.error('Error uploading video:', err);
            return res.status(500).json({ success: false, message: 'Error uploading video' });
        }

        try {
            const { title } = req.body;
            const videoFile = req.file.path;

            const newVideo = new Video({
                title,
                videoFile
            });

            await newVideo.save();

            res.status(201).json({ success: true, message: 'Video uploaded successfully' });
        } catch (error) {
            console.error('Error saving video:', error.message);
            res.status(500).json({ success: false, message: 'Error saving video' });
        }
    });
};

const getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find();
        res.status(200).json({ success: true, videos });
    } catch (error) {
        console.error('Error fetching videos:', error.message);
        res.status(500).json({ success: false, message: 'Error fetching videos' });
    }
};

const getVideoById = async (req, res) => {
    const { videoId } = req.params;
    try {
        const video = await Video.findOne({ videoId });
        if (!video) {
            return res.status(404).json({ success: false, message: 'Video not found' });
        }
        res.status(200).json({ success: true, video });
    } catch (error) {
        console.error('Error fetching video by ID:', error.message);
        res.status(500).json({ success: false, message: 'Error fetching video' });
    }
};

module.exports = { uploadVideo, getAllVideos, getVideoById };
