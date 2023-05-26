// imports
const { Router } = require('express');
const mainController = require('../controllers/mainController');

const router = Router();

// routes
router.get('/', mainController.home_get);
router.get('/sign-in', mainController.signin_get);
router.get('/sign-up', mainController.signup_get);
router.get('/user/:username', mainController.userpage_get);

module.exports = router;