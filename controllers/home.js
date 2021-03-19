/* -------- Models Import -------- */
const Ques = require("../models/question");
const Interest = require("../models/interest");
const { convertDate } = require("../util/file");

exports.getHome = async (req, res, next) => {
  try {
    const interest = await Interest.find({}, { category: true }).lean();
    const questions = await Ques.find(
      {},
      { title: true, interests: true }
    ).lean();
    for (const q of questions) {
      q.interests = q.interests.split(",");
    }
    res.render("frontend/index", {
      pageTitle: "Home",
      path: "/",
      interest,
      questions,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.searchQuery = async (req, res, next) => {
  try {
    const s = req.query.s;
    const interest = await Interest.find({}, { category: true }).lean();
    const questions = await Ques.find(
      {
        title: { $regex: ".*" + s + ".*" },
      },
      { title: true, interests: true, createdAt: true }
    ).lean();
    for (const q of questions) q.interests = q.interests.split(",");
    for (const q of questions) q.createdAt = convertDate(q.createdAt);
    res.render("frontend/questions", {
      pageTitle: "Home",
      path: "/",
      questions,
      interest,
      s,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.bookmarkQues = async (req, res, next) => {
  try {
    const quesId = req.params.quesId;
    const ques = await Ques.findById(quesId).lean();
    if (!ques) return;
    const bookmarkIndex = req.user.bookmarks.findIndex((b) => {
      return b.quesId.toString() === quesId.toString();
    });
    if (bookmarkIndex !== -1) {
      req.user.bookmarks.splice(bookmarkIndex, 1);
    } else {
      req.user.bookmarks.push({ quesId });
    }
    await req.user.save();
    return res.json({ bookmarked: "done" });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.viewQues = async (req, res, next) => {
  try {
    const quesId = req.params.quesId;
    const ques = await Ques.findById(quesId, {
      title: true,
      body: true,
      //owner: true,
      interests: true,
      createdAt: true,
      answers: true,
    }).lean();
    if (!ques) return;
    ques.interests = ques.interests.split(",");
    ques.createdAt = convertDate(ques.createdAt);
    res.render("frontend/answers", {
      pageTitle: ques.title,
      path: "/",
      ques: ques,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
