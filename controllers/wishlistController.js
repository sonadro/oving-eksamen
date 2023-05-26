// imports
const Wishlist = require('../models/Wishlist');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config.json');

// controller
module.exports.wishlist_createUpdate = async (req, res) => {
    const wishlist = req.body.wishlist;
    const token = req.cookies.jwt;

    // check if user has a token
    if (token) {
        // verify token
        jwt.verify(token, jwtSecret, async (err, decodedToken) => {
            if (err) {
                console.error(err);
                // invalid token, deny request
                res.send({
                    status: 'You aren\'t logged in',
                    code: 'userErr'
                });
            } else {
                // valid token, find user
                const dbUser = await User.findOne({ _id: decodedToken.id });

                if (dbUser) {
                    // user exists, find their wishlist
                    const dbWishlist = await Wishlist.findOne({ owner: dbUser.username });

                    const localWishlist = {
                        items: wishlist,
                        owner: dbUser.username
                    };

                    if (dbWishlist) {
                        // wishlist exists, update it
                        await dbWishlist.updateOne(localWishlist);
                        res.send({
                            status: 'Wishlist has been updated',
                            code: 'ok'
                        });
                    } else {
                        // wishlist doesn't exist, create it
                        const document = await Wishlist.create(localWishlist);

                        res.send({
                            status: 'Wishlist has been created',
                            code: 'ok'
                        });
                    };
                } else {
                    // user doesn't exist, deny request
                    res.send({
                        status: 'User not found',
                        code: 'serverErr'
                    });
                };
            };
        });
    } else {
        // user has no token, deny request
        res.send({
            status: 'You aren\'t logged in',
            code: 'userErr'
        });
    };
};

module.exports.wishlist_get = async (req, res) => {
    const username = req.body.username;

    // find the wishlist with matching username
    const wishlist = await Wishlist.findOne({ owner: username });

    res.send(wishlist);
};

module.exports.wishlist_getall = async (req, res) => {
    const allWishlists = await Wishlist.find({ });

    res.send(allWishlists);
};