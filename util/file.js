// const fs = require('fs');
// const fetch = require('node-fetch');
// const { stringify } = require('querystring');
const subInterest = require('../models/subCategory');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.sendgridApi);

// Send Mail To USer
exports.sendMail = (from, to, subject, content) => {
  const msg = {
    to: to,
    from: from,
    subject: subject,
    html: content,
  };
  // sgMail.send(msg);
  console.log('email Send');
};

// Provide Current Date
exports.currDate = () => {
  const today = new Date();
  const date =
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  return date;
};

exports.getSubInterestArr = async () => {
  const result = await subInterest
    .find({}, { _id: false, subInterest: true })
    .lean();
  let string = '';
  if (result.length > 0) {
    const subInterestArr = result.map((e) => e.subInterest);
    // subInterestArr.forEach((r) => {
    //   string += `'${r}',`;
    // });
    string = subInterestArr.join("','");
  }
  return string;
};

exports.filteredTagsInput = (quesTags) => {
  const filteredTags = quesTags.substring(1, quesTags.length - 1);
  let normalizeTags = '';
  for (const t of filteredTags) {
    if (t !== '"') normalizeTags += t;
  }
  const tags = normalizeTags.split(',');
  return tags;
};
