const { Schema, model } = require('mongoose');

const dateFormat = require('../utils/dateFormat');

//So for the most part, this feels a lot like Sequelize. We essentially create a schema, using the Schema constructor we imported from Mongoose, and define the fields with specific data types. We don't have to define the fields, as MongoDB will allow the data anyway, but for for clarity and usability, we should regulate what the data will look like.

// See how we don't have to use special imported data types for the type definitions? Using MongoDB and Mongoose, we simply instruct the schema that this data will adhere to the built-in JavaScript data types, including strings, Booleans, numbers, and so on.

// Notice the empty brackets [] in the toppings field. This indicates an array as the data type. You could also specify Array in place of the brackets.

// side note** MongoDB automatically provides an _id so that you don't have to worry about setting it up
//If you wanted to change the name of the _id field— to pizzaId, for example—you could override it in Mongoose.

const PizzaSchema = new Schema({
    pizzaName: {
      type: String,
      required: true,
      //trim option that's been added, which works just like the JavaScript .trim() method and removes white space before and after the input string. You'll find that useful when working with username and password data
      trim: true
    },
    createdBy: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      //In programming, a getter is typically a special type of function that takes the stored data you are looking to retrieve and modifies or formats it upon return. Think of it like middleware for your data!

      // To use a getter in Mongoose, we just need to add the key get to the field we are looking to use it with in the schema. Just like a virtual, the getter will transform the data before it gets to the controller(s)
      get: (createdAtVal)=> dateFormat(createdAtVal)
    },
    size: {
      type: String,
      required: true,
      //In this example, the enum option stands for enumerable, a popular term in web development that refers to a set of data that can be iterated over—much like using the for...in loop to iterate through an object.

      //With this validation option in place, we provide an array of options that this size field will accept. If a user attempts to enter a pizza size not listed—for example, a size value of "Super Mega Large"—the validation simply won't allow it
      enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
      default: 'Large'
    },
    toppings: [],
    
    // CREATE ASSOCIATION, associate Pizza and Commment Models 
    //we need to tell Mongoose to expect an ObjectId and to tell it that its data comes from the Comment model.
    comments: [
      {
        type: Schema.Types.ObjectId,
        //The ref property is especially important because it tells the Pizza model which documents to search to find the right comments
        ref: 'Comment'
      }
    ]
  },
  {
    //we'll need to tell the Mongoose model that it should use any virtual and getter function we've specified
    toJSON: {
      virtuals: true,
      getters: true
    },
    //We set id to false because this is a virtual that Mongoose returns, and we don’t need it.
    id:false
  }
  
);

//--------- ADD VIRTUAL (aka virtual properties) to the PizzaSchema-----------//

//Virtuals allow you to add virtual properties to a document that aren't stored in the database. They're normally computed values that get evaluated when you try to access their properties
// get total count of comments and replies on retrieval
//Virtuals allow us to add more information to a database response so that we don't have to add in the information manually with a helper before responding to the API request

//need to do one more thing—we need to tell the schema that it can use virtuals.
//To do so, you'll need to add the toJSON property to the schema options

// this virtual gets the length of the comment array 
//Here we're using the .reduce() method to tally up the total of every comment with its replies. In its basic form, .reduce() takes two parameters, an accumulator and a currentValue. Here, the accumulator is total, and the currentValue is comment. As .reduce() walks through the array, it passes the accumulating total and the current value of comment into the function, with the return of the function revising the total for the next iteration through the array.
PizzaSchema.virtual('commentCount').get(function() {
  return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

//Now we need to actually create the model to get the prebuilt methods that Mongoose provides. Let's add the following code to create the model and export it at the bottom of Pizza.js:

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);








// export the Pizza model
module.exports = Pizza;
