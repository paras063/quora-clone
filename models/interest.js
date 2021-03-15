const mongoose = require("mongoose");
const interestSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    following: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Interest", interestSchema);

//DEVELOPMENT
// {name :weddev, ques:[50]} | {name :mobiledev, ques:[50]} | {name :DATA Scinece, ques:[50]}
