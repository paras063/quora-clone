const express = require('express');
const interestController = require('../controllers/admin/interest');
const adminController = require('../controllers/admin/admin');
const auth = require('../middleware/is-auth');
const { body } = require('express-validator');
const router = express.Router();

// --------------- Admin Routes---------------
router.get(
  '/',
  // auth.isAuthAdmin,
  adminController.getHome
);

// --------------- INTEREST Routes---------------
router.get(
  '/add-category',
  // auth.isAuthAdmin,
  interestController.getAddInterest
);

router.post(
  '/add-category',
  // auth.isAuthAdmin,
  body('tag', 'Category Name Cant be empty').notEmpty(),
  interestController.postAddInterest
);

router.get(
  '/add-sub-category',
  //auth.isAuthAdmin,
  interestController.getAddSubInterest
);

router.post(
  '/add-sub-category',
  //auth.isAuthAdmin,
  [
    body('interest', 'Please Select Valid Category ').notEmpty(),
    body('subFields', 'Please Enter Sub-Category').notEmpty(),
  ],
  interestController.postAddSubInterest
);

router.get(
  '/find-sub-interest/:interestId',
  //auth.isAuthAdmin,
  interestController.findSubInterest
);

module.exports = router;
