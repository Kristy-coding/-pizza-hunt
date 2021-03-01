const { Schema, model } = require('mongoose');

//So for the most part, this feels a lot like Sequelize. We essentially create a schema, using the Schema constructor we imported from Mongoose, and define the fields with specific data types. We don't have to define the fields, as MongoDB will allow the data anyway, but for for clarity and usability, we should regulate what the data will look like.

// See how we don't have to use special imported data types for the type definitions? Using MongoDB and Mongoose, we simply instruct the schema that this data will adhere to the built-in JavaScript data types, including strings, Booleans, numbers, and so on.

// Notice the empty brackets [] in the toppings field. This indicates an array as the data type. You could also specify Array in place of the brackets.

// side note** MongoDB automatically provides an _id so that you don't have to worry about setting it up
//If you wanted to change the name of the _id field— to pizzaId, for example—you could override it in Mongoose.

const PizzaSchema = new Schema({
    pizzaName: {
      type: String
    },
    createdBy: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    size: {
      type: String,
      default: 'Large'
    },
    toppings: []
  });

//Now we need to actually create the model to get the prebuilt methods that Mongoose provides. Let's add the following code to create the model and export it at the bottom of Pizza.js:

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);








// export the Pizza model
module.exports = Pizza;
