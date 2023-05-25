// imports
const { Router } = require('express');
const mainController = require('../controllers/mainController');

const router = Router();

// routes
router.get('/', mainController.home_get);

module.exports = router;