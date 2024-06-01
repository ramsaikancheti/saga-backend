const multer = require('multer');
const Audio = require('../models/audio.model');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/songs/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('audio/') || file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).fields([
    { name: 'audioFile', maxCount: 1 },
    { name: 'image', maxCount: 1 }  
]);

const uploadAudio = async (req, res) => {
    try {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                console.error('Multer error:', err);
                return res.status(400).json({ success: false, message: 'Error uploading files' });
            } else if (err) {
                console.error('Error uploading files:', err);
                return res.status(500).json({ success: false, message: 'Error uploading files' });
            }

            if (!req.files || Object.keys(req.files).length === 0) {
                console.error('No files uploaded');
                return res.status(400).json({ success: false, message: 'No files uploaded' });
            }

            const { title, artist } = req.body;
            if (!title || !artist) {
                console.error('Title or artist missing');
                return res.status(400).json({ success: false, message: 'Title or artist missing' });
            }

            const audioFiles = req.files['audioFile'];
            const imageFiles = req.files['image'];

            if (!audioFiles || audioFiles.length === 0 || !audioFiles[0].path || !imageFiles || imageFiles.length === 0 || !imageFiles[0].path) {
                console.error('Audio or image file not found');
                return res.status(400).json({ success: false, message: 'Audio or image file not found' });
            }

            const audioFile = audioFiles[0].path;
            const imageFile = imageFiles[0].path;

            console.log('Uploaded audio file:', audioFile);
            console.log('Uploaded image file:', imageFile);

            const newAudio = new Audio({
                title,
                artist,
                audioFile,
                imageFile
            });

            await newAudio.save();

            res.status(201).json({ success: true, message: 'Audio uploaded successfully' });
        });
    } catch (error) {
        console.error('Error uploading audio:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


const getAllAudio = async (req, res) => {
    try {
        const mediaFiles = await Audio.find({}, 'audioId title artist audioFile imageFile').lean();

        if (!mediaFiles || mediaFiles.length === 0) {
            return res.status(404).json({ success: false, message: 'No media files found' });
        }

        res.status(200).json({ success: true, mediaFiles });
    } catch (error) {
        console.error('Error getting media files:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = { uploadAudio, getAllAudio };
