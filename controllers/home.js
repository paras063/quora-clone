/* -------- Models Import -------- */
const Ques = require('../models/question');
const Interest = require('../models/interest');
exports.getHome = async (req, res, next) => {
  try {
    const interest = await Interest.find({}, { category: true }).lean();    
    const questions = await Ques.find(
      {},
      { title: true, interests: true }
    ).lean();
    for (const q of questions) {
      q.interests = q.interests.split(',');
    }    
    res.render('frontend/index', {
      pageTitle: 'Home',
      path: '/',
      interest,
      questions,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
