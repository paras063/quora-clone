const mongoose = require('mongoose');
const AnswerSchema = new mongoose.Schema(
  {
    quesId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Ques',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    answer: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    likes: {
      type: Number,
    },
    dislikes: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Ans', AnswerSchema);
