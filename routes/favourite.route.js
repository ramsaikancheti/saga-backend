const express = require('express');
const router = express.Router();

const { addToFavourites, removeFromFavourites, getAllFavourites } = require('../controllers/favourite.controller');

router.post('/api/post/fav/:audioId', addToFavourites);
router.delete('/api/delete/fav/:audioId', removeFromFavourites);
router.get('/api/get/favourites', getAllFavourites);


module.exports = router;