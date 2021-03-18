/* -------- Models Import -------- */
const Ques = require('../models/question');
const subInterest = require('../models/subCategory');
const { getSubInterestArr, filteredTagsInput } = require('../util/file');
const { validationResult } = require('express-validator');

exports.getAddQues = async (req, res, next) => {
  try {
    res.render('frontend/ques', {
      pageTitle: 'Add Question',
      path: '/',
      oldInput: null,
      subInterestArr: await getSubInterestArr(),
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postAddQues = async (req, res, next) => {
  try {
    const quesTitle = req.body.quesTitle.trim();
    const quesBody = req.body.quesBody.trim();
    const quesTags = req.body.quesTags.trim();

    // Validating Users Inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ success: false, errors: errors.array() });
    }

    // Submits to Database
    const tags = filteredTagsInput(quesTags);
    const ques = {
      title: quesTitle,
      body: quesBody,
      interests: tags.join(),
      // owner: req.user._id,
    };
    const result = await Ques.create(ques);
    let interest;
    tags.forEach(async (tag) => {
      interest = await subInterest.findOne({ subInterest: tag });
      interest.ques.push(result._id);
      await interest.save();
    });
    res.json({ success: true });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};


//user view his own questions
exports.viewAllQues = async (req, res) => {
  try {
    const showQues = await Ques.find({ owner: req.user._id });
    if (!showQues) {
      console.log('not found');
    } else {
      console.log(showQues);
    }
  } catch (err) {
    console.log(err);
  }
};



//user update particular question
exports.updateQues = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedFields = ['question', 'category'];
  const updateValid = updates.every((data) => allowedFields.includes(data));
  if (!updateValid) {
    return console.log('not allowed');
  }
  try {
    const updateQues = await Ques.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!updateQues) {
      console.log('failed to found');
    } else {
      updates.forEach((update) => (updateQues[update] = req.body[update]));
      await updateQues.save();
      console.log(updateQues);
    }
  } catch (err) {
    console.log(err);
  }
};

// user delete particular question
exports.deleteQues = async (req, res) => {
  try {
    const ques = await Ques.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!ques) {
      console.log('not found');
    } else {
      console.log('done', ques);
    }
  } catch (err) {
    console.log(err);
  }
};

// //user delete all questions
// exports.deleteAllQues = async (req, res) => {
//   try {
//     const deleted = await Ques.deleteMany({ owner: req.user._id });
//     if (!deleted) {
//       console.log('not deleted');
//     } else {
//       console.log('done', deleted);
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };
