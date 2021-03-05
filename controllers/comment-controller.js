const { Comment, Pizza } = require('../models');


//create a commentController object
const commentController = {

    //All right, so we've got the skeleton set up, but this is where the similarities with pizza-controller.js end. Remember that when we create a comment, it’s not a standalone comment; it belongs to a pizza. We need to know exactly which pizza we’re working with
    // add comment to pizza method 
    addComment({ params, body }, res) {
        console.log(body);
        Comment.create(body)
          .then(({ _id }) => {
            return Pizza.findOneAndUpdate(
              { _id: params.pizzaId },
              //MongoDB-based functions like $push start with a dollar sign ($)
              //The $push method works just the same way that it works in JavaScript—it adds data to an array
              { $push: { comments: _id } },
              //Again, because we passed the option of new: true, we're receiving back the updated pizza (the pizza with the new comment included)
              //When you add data into a nested array of a MongoDB document, they become what's known as a "nested document" or "subdocument"
              { new: true }
            );
          })
          .then(dbPizzaData => {
            if (!dbPizzaData) {
              res.status(404).json({ message: 'No pizza found with this id!' });
              return;
            }
            res.json(dbPizzaData);
          })
          .catch(err => res.json(err));
      },


    // add reply method 
    addReply({ params, body }, res) {
      Comment.findOneAndUpdate(
        { _id: params.commentId },
        { $push: { replies: body } },
        { new: true, runValidators: true }
      )
        .then(dbPizzaData => {
          if (!dbPizzaData) {
            res.status(404).json({ message: 'No pizza found with this id!' });
            return;
          }
          res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    },

    // remove comment / delete method
    removeComment({ params }, res) {
        Comment.findOneAndDelete({ _id: params.commentId })
          .then(deletedComment => {
            if (!deletedComment) {
              return res.status(404).json({ message: 'No comment with this id!' });
            }
            return Pizza.findOneAndUpdate(
              { _id: params.pizzaId },
              { $pull: { comments: params.commentId } },
              { new: true }
            );
          })
          .then(dbPizzaData => {
            if (!dbPizzaData) {
              res.status(404).json({ message: 'No pizza found with this id!' });
              return;
            }
            res.json(dbPizzaData);
          })
          .catch(err => res.json(err));
      },

      //The first method used here, .findOneAndDelete(), works a lot like .findOneAndUpdate(), as it deletes the document while also returning its data. We then take that data and use it to identify and remove it from the associated pizza using the Mongo $pull operation. Lastly, we return the updated pizza data, now without the _id of the comment in the comments array, and return it to the user

  // remove reply
  //Here, we're using the MongoDB $pull operator to remove the specific reply from the replies array where the replyId matches the value of params.replyId passed in from the route.

  removeReply({ params }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $pull: { replies: { replyId: params.replyId } } },
      { new: true }
    )
      .then(dbPizzaData => res.json(dbPizzaData))
    .catch(err => res.json(err));
  }
};


module.exports = commentController;



