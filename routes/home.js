// ---------------   Module Imports  ---------------
const express = require('express');
const homeController = require('../controllers/home');
const auth = require('../middleware/is-auth');

// Initializing Router
const router = express.Router();

// ---------------  Index  ---------------
router.get('/', homeController.getHome);
router.get('/search', homeController.searchQuery);
router.get('/bookmark/:quesId',  homeController.bookmarkQues);

module.exports = router;
