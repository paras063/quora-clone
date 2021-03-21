const Interest = require("../../models/interest");
const subInterest = require("../../models/subCategory");
const { validationResult } = require("express-validator");

exports.getAddInterest = async (req, res, next) => {
  try {
    const interest = await Interest.find({}, { category: true });
    res.render("backend/addInterest", {
      pageTitle: "Add Interest",
      path: "/admin/add-category",
      errorMsg: null,
      interest,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postAddInterest = async (req, res, next) => {
  try {
    const category = req.body.tag.toLowerCase();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const interest = await Interest.find({}, { category: true });
      return res.status(422).render("backend/addInterest", {
        pageTitle: "Add Interest",
        path: "/admin/add-category",
        errorMsg: errors.array()[0].msg,
        interest,
      });
    }
    const duplicate = await Interest.findOne({
      category: category,
    });
    if (duplicate) {
      const interest = await Interest.find({}, { category: true });
      return res.status(422).render("backend/addInterest", {
        pageTitle: "Add Interest",
        path: "/admin/add-category",
        errorMsg: "Category Already exist !",
        interest,
      });
    }
    const check = await Interest.create({ category: category });
    res.redirect("/admin/add-category");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getAddSubInterest = async (req, res, next) => {
  try {
    const interest = await Interest.find({}, { category: true });
    res.render("backend/addSubInterest", {
      pageTitle: "Add Sub-Interest",
      path: "/admin/add-sub-category",
      interest: interest,
      errorMsg: null,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postAddSubInterest = async (req, res, next) => {
  try {
    const interestId = req.body.interest;
    const subFields = req.body.subFields.toLowerCase();

    // Checking inputFields Errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const interest = await Interest.find({}, { category: true });
      return res.status(422).render("backend/addSubInterest", {
        pageTitle: "Add Sub Interest",
        path: "/admin/add-sub-category",
        errorMsg: errors.array()[0].msg,
        interest: interest,
      });
    }
    const tags = subFields.split(",");
    for (const tag of tags) {
      const notUnique = await subInterest.findOne({ subInterest: tag });
      if (!notUnique)
        await subInterest.create({ interest: interestId, subInterest: tag });
    }
    res.redirect("/admin/add-sub-category");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.findSubInterest = async (req, res, next) => {
  try {
    const interestId = req.params.interestId;
    const subCategory = await subInterest.find({ interest: interestId });
    const subInterestColl = subCategory.map((e) => {
      return {
        subInterest: e.subInterest,
        _id: e._id,
      };
    });
    res.json({ subInterestColl });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
