// imports
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { jwtSecret } = require('../config.json');

// jwt
const maxAge = 60 * 60 * 24 * 3;
const createToken = id => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: maxAge
    });
};

// controller
module.exports.user_signup = async (req, res) => {
    const userDetails = req.body.user;
    
    // check if username meets length criteria
    if (userDetails.username.length < 3) {
        res.send({
            status: 'Your username must be at least 3 characters long.',
            code: 'userErr'
        });
    } else if (userDetails.username.length > 15) {
        res.send({
            status: 'Your username may not be more than 15 characters long.',
            code: 'userErr'
        });
    } else {
        // username meets length criteria, check if username already exists
        const userExists = await User.findOne({ username: userDetails.username });
        if (userExists) {
            res.send({
                status: `The username '${userDetails.username}} is already taken.`,
                code: 'userErr'
            });
        } else {
            // username meets all criteria, check password length
            if (userDetails.password.length < 5) {
                res.send({
                    status: 'Your password must be at least 5 characters long.',
                    code: 'userErr'
                });
            } else {
                // password meets length criteria, check if both passwords match
                if (userDetails.password !== userDetails.repeatPassword) {
                    res.send({
                        status: 'Both passwords must match!',
                        code: 'userErr'
                    });
                } else {
                    // all criteria are met, attempt to encrypt password & save user
                    try {
                        let user = {
                            username: userDetails.username,
                            password: userDetails.password
                        };
    
                        // encrypt password
                        const salt = await bcrypt.genSalt();
                        user.password = await bcrypt.hash(user.password, salt);

                        // save user
                        const document = await User.create(user);

                        // log in the user
                        const token = createToken(document._id.toString());

                        res.cookie('jwt', token, {
                            sameSite: 'strict',
                            httpOnly: true,
                            expiresIn: maxAge * 1000
                        });

                        res.status(200).send({
                            status: 'Logged in! Redirecting..',
                            code: 'ok'
                        });
                    } catch(err) {
                        console.error(err);
                        res.status(400).send({
                            status: 'Unable to create account, try agan later.',
                            code: 'serverErr'
                        });
                    };
                };
            };
        };
    };
};

module.exports.user_signin = async (req, res) => {
    const userDetails = req.body.user;

    const dbUser = await User.findOne({ username: userDetails.username });

    // check if user exists
    if (dbUser) {
        // check if passwords match
        const auth = await bcrypt.compare(userDetails.password, dbUser.password);

        if (auth) {
            // passwords match, log in user
            const token = createToken(dbUser._id.toString());

            res.cookie('jwt', token, {
                sameSite: 'strict',
                httpOnly: true,
                maxAge: maxAge * 1000
            });

            res.send({
                status: `Successfully logged in as '${dbUser.username}!'`,
                code: 'ok'
            });
        } else {
            res.send({
                status: 'Wrong password.',
                code: 'userErr'
            });
        }
    } else {
        res.send({
            status: `Couldn't find a user with the username '${userDetails.username}.`,
            code: 'userErr'
        });
    }
};

module.exports.user_signout = (req, res) => {
    res.cookie('jwt', "", {maxAge: 1});
    res.redirect("/");
};