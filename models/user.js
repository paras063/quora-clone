const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, lowercase: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    emailVerify: { type: Boolean, required: true, default: false },
    isAdmin: { type: Boolean, required: true, default: false },
    doj: { type: Date, required: true, default: Date.now() },
    interestAreas: [
      {
        interest: { type: mongoose.Schema.Types.ObjectId, ref: 'Interest' },
      },
    ],
    bookmarks: [
      {
        quesId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ques' },
      },
    ],
    activationToken: String,
    resetToken: String,
    resetTokenExpiration: Date,
    profileImg: String,
    dob: Date,
    organization: String,
    gender: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
