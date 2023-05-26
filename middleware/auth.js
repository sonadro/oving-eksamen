// packages
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config.json');
const User = require('../models/User');

// logged in check
const loggedInCheck = (req, res, next) => {
    // get users jwt
    const token = req.cookies.jwt;

    // check if user has a token
    if (token) {
        // user has token, verify it
        jwt.verify(token, jwtSecret, async (err, decodedToken) => {
            if (err) {
                // invalid token, user isn't signed in
                console.error(err);

                // remove the invalid cookie
                res.cookie('jwt', '', { maxAge: 1 });
                next();
            } else {
                // user is logged in
                const user = await User.findOne({ _id: decodedToken.id });

                if (user) {
                    // user exists, log them in
                    res.locals.loggedInUser = user.username;
                    res.locals.loggedIn = true;
                } else {
                    // user doesn't exist, remove cookie
                    res.cookie('jwt', '', { maxAge: 1 });
                    res.locals.loggedIn = false;
                };
                next();
            };
        });
    } else {
        // user has no token, they aren't signed in
        res.locals.loggedIn = false;
        next();
    };
};

// export functions
module.exports = { loggedInCheck };