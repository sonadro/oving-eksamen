// imports
const { Router } = require('express');
const mainController = require('../controllers/mainController');
const { loggedInCheck } = require('../middleware/auth');

const router = Router();

// run logged in check for every page:
router.use(loggedInCheck);

// routes
router.get('/', mainController.home_get);
router.get('/sign-in', mainController.signin_get);
router.get('/sign-up', mainController.signup_get);
router.get('/user/:username', mainController.userpage_get);
router.get('/home', mainController.userhome_get);
router.get('/home/:username', mainController.userhome_get);

module.exports = router;