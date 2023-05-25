// imports
const { Router } = require('express');
const userController = require('../controllers/userController');

const router = Router();

// routes
router.post('/user-signup', userController.user_signup);
router.post('/user-signin', userController.user_signin);

module.exports = router;