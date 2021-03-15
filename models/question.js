const mongoose = require('mongoose');
const questionSchema = new mongoose.Schema(
  {
    interests: { type: String, required: true },
    title: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,      
    },
    body: {
      type: String,
      trim: true,
      lowercase: true,
    },

    // owner: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: "User",
    // },

    isApproved: {
      type: Boolean,
      required: true,
      default: true,
    },

    timesRead: {
      type: Number,
    },
    
    searchString: {
      type: String,
    },
    answers: [
      {
        ans: {
          type: String,
          trim: true,
          lowercase: true,
        },
        like: {
          type: Number,
          default: 0,
        },
        dislike: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Ques', questionSchema);
