const mongoose = require('mongoose');
const subInterestSchema = new mongoose.Schema(
  {
    interest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interest',
    },
    subInterest: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
    },
    ques: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ques',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('subInterest', subInterestSchema);

//DEVELOPMENT
// find({interest : interestId}) =>
/*

Development  = [{sub:WEB,ques:[50 quesId]}, {sub:MOBILE,ques:[50 quesId]}, {sub:Data Anyly,ques:[50 quesId]}];

questionToDisplay  = {sub: ,final:[5]}

interestData.forEach(d     =>{
    d.ques.forEach((quesId)=>{
            result = Ques.findById(or{likeRatio >80% created < 5days }
                if(result) {
                 questionToDisplay[d.sub]
                }
    })
)
})
finalQuestionToDisplay = 100 Questions
*/
