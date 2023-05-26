// packages
const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    items: {
        type: Array
    },
    owner: {
        type: String
    }
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;