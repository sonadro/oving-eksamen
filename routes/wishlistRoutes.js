// imports
const { Router } = require('express');
const wishlistController = require('../controllers/wishlistController');

const router = Router();

// routes
router.post('/wishlist-create-update', wishlistController.wishlist_createUpdate);
router.post('/wishlist-get', wishlistController.wishlist_get);

module.exports = router;