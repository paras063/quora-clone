// ---------------   Module Imports  ---------------
const express = require('express');
const { body } = require('express-validator');
const quesController = require('../controllers/ques.js');
const auth = require('../middleware/is-auth');

// Initializing Router
const router = express.Router();

// ---------------  Index  ---------------
router.get('/add-question', quesController.getAddQues);
router.post(
  '/add-question',
  [
    body('quesTitle', 'Title of Question Cant Be empty').trim().notEmpty(),
    body('quesBody', 'Body of Question Cant Be empty').trim().notEmpty(),
    body('quesTags', 'Tags of Question Cant Be empty').trim().notEmpty(),
  ],
  quesController.postAddQues
);

router.get('/edit-question/:quesId', quesController.getAddQues);
router.post(
  '/edit-question',
  [
    body('quesTitle', 'Title of Question Cant Be empty').trim().notEmpty(),
    body('quesBody', 'Body of Question Cant Be empty').trim().notEmpty(),
    body('quesTags', 'Tags of Question Cant Be empty').trim().notEmpty(),
  ],
  quesController.postAddQues
);
module.exports = router;
