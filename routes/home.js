// ---------------   Module Imports  ---------------
const express = require('express');
const homeController = require('../controllers/home');


// Initializing Router
const router = express.Router();

// ---------------  Index  ---------------
router.get('/', homeController.getHome);


module.exports = router;
