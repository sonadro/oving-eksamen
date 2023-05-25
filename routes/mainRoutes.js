// imports
const { Router } = require('express');
const mainController = require('../controllers/mainController');

const router = Router();

// routes
router.get('/', mainController.home_get);
router.get('/log-in', mainController.login_get);

module.exports = router;