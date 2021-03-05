const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

//Now we'll work on integrating replies with comments. Just like comments, we could use another model for replies, but it’s not really necessary since we'll never query for just reply data. Instead, let's take advantage of some of the flexibility that MongoDB provides and create replies as a subdocument array for comments. To normalize it, we'll create a schema for it.
const ReplySchema = new Schema(
  {

    // set custom id to avoid confusion with parent comment _id
    replyId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },
    replyBody: {
      type: String
    },
    writtenBy: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => dateFormat(createdAtVal)
    }
  },
  {
    toJSON: {
      getters: true
    }
  }
);

const CommentSchema = new Schema({
  writtenBy: {
    type: String
  },
  commentBody: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: createdAtVal => dateFormat(createdAtVal)
  },

  // associate replies with comments. Update the CommentSchema to have the replies field populated with an array of data that adheres to the ReplySchema definition
  //Note that unlike our relationship between pizza and comment data, replies will be nested directly in a comment's document and not referred to.
  // // use ReplySchema to validate data for a reply
  replies: [ReplySchema]
},
{
  toJSON: {
    virtuals: true,
    getters: true
  },
  id: false
}
);


//Next, let's add a virtual for CommentSchema to get the total reply count. We'll use this later to combine the reply count with the comment count so that users can get a full picture of the discussion around a pizza. Showing more discussion around a pizza may snowball into more interest!

//Just as you've done for the pizza's schema, add a virtual to get the total reply count
CommentSchema.virtual('replyCount').get(function() {
  return this.replies.length;
});


const Comment = model('Comment', CommentSchema);

module.exports = Comment;
