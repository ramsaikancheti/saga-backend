const mongoose = require('mongoose');
const Favourite = require('../models/favourite.model');
const Audio = require('../models/audio.model');


async function addToFavourites(req, res) {
    try {
        const { audioId } = req.params;

        const audioDetails = await Audio.findOne({ audioId });

        if (!audioDetails) {
            return res.status(404).json({ success: false, message: 'Audio not found for the given audioId.' });
        }

        const newFavourite = new Favourite({
            audios: [audioDetails.toObject()],
        });

        await newFavourite.save();

        res.json({ success: true, message: 'Audio added to favourites successfully!', favouriteId: newFavourite._id });

    } catch (error) {
        console.error('Error adding audio to favourites:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

async function removeFromFavourites(req, res) {
    try {
        const { audioId } = req.params;

        console.log('Requested audioId:', audioId);

        const favouriteEntry = await Favourite.findOne({ 'audios.audioId': parseInt(audioId) });

        console.log('Favourite entry:', favouriteEntry);

        if (!favouriteEntry) {
            console.log('No favourite entry found with audioId:', audioId);
            return res.status(404).json({ success: false, message: 'Audio not found in favourites.' });
        }

        favouriteEntry.audios = favouriteEntry.audios.filter((audio) => audio.audioId !== parseInt(audioId));

        if (favouriteEntry.audios.length === 0) {
            await Favourite.findByIdAndDelete(favouriteEntry._id);
        } else {
            await favouriteEntry.save();
        }

        res.json({ success: true, message: 'Audio removed from favourites successfully!' });

    } catch (error) {
        console.error('Error removing audio from favourites:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}



async function getAllFavourites(req, res) {
    try {
        const favourites = await Favourite.find();
        res.json({ success: true, favourites });
    } catch (error) {
        console.error('Error fetching favourites:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}





module.exports = {addToFavourites, removeFromFavourites, getAllFavourites};