//Think back to how you created servers in previous applications. We've used both of the following approaches:

//Set it up so that the routes directory holds not only the routes but also the functionality for those endpoints to perform.

//Tightly follow MVC patterns and hold both the routes and functionality in a controllers directory

// For this project, you’ll create the functionality in controllers and the endpoints in routes. You’ll end up with more files but much cleaner code
//--------------------------------------------------------------------------------//
// requiring the Pizza model in from the index.js file of models directory 
//Now that we've created the file and directory, let's work on the functionality. We'll create all of these functions as methods of the pizzaController object. Because these methods will be used as the callback functions for the Express.js routes, each will take two parameters: req and res

// This style of writing object methods is another new feature of JavaScript. We can now write them in one of two ways, as shown in the following example:

// const dogObject = {
//     // this...
//     bark: function() {
//       console.log('Woof!');
//     },
  
//     // ... is the same as this
//     bark() {
//       console.log('Woof!');
//     }
// }


const { Pizza } = require('../models');

// defining the pizzaController object and it's methods 
const pizzaController = {

//---------methods for GET/api/pizzas and GET/api/pizzas/id--------//

  // get all pizzas 
  //The first method, getAllPizza(), will serve as the callback function for the GET /api/pizzas route. It uses the Mongoose .find() method, much like the Sequelize .findAll() method
  getAllPizza(req,res){
      Pizza.find({})
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err=>{
          res.status(400).json(err);
      });
  },
  // get one pizza by id
  //The second method, .getPizzaById(), uses the Mongoose .findOne() method to find a single pizza by its _id. Instead of accessing the entire req, we've destructured params out of it, because that's the only data we need for this request to be fulfilled
  getPizzaById({ params }, res) {
      Pizza.findOne({ _id: params.id })
        .then(dbPizzaData => {
            // if no pizza is found, send 4040
            if(!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!'});
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => {
            console.log(err);
            res.status(404).json(err);
        });
  },

  //---------method for handling POST /api/pizzas----------//

  //With this .createPizza() method, we destructure the body out of the Express.js req object because we don't need to interface with any of the other data it provides. Again, just like with Sequelize, in Mongoose we use the method .create() to create data
  //In MongoDB, the methods for adding data to a collection are .insertOne() or .insertMany(). But in Mongoose, we use the .create() method, which will actually handle either one or multiple inserts
  // createPizza
    createPizza({ body }, res) {
        Pizza.create(body)
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => res.status(400).json(err));
  },

  //----------Now let's add the method for updating a pizza when we make a request to PUT /api/pizzas/:id-----//
  //With this .findOneAndUpdate() method, Mongoose finds a single document we want to update, then updates it and returns the updated document. If we don't set that third parameter, { new: true }, it will return the original document. By setting the parameter to true, we're instructing Mongoose to return the new version of the document
  // update pizza by id
  updatePizza({ params, body }, res){
      Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true })
        .then(dbPizzaData => {
            if (!dbPizzaData){
                res.status(404).json({ message: 'No pizza found with this id!'});
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err));
  },
  //------create the method to delete a pizza from the database when we make a request to DELETE /api/pizzas/:id-----//
  //In this example, we use the Mongoose .findOneAndDelete() method, which will find the document to be returned and also delete it from the database
  // delete pizza
  // we destructure the express req object to params 
  // could also be req and then when we pass in an object to be deleted to findOneAndDelete we would pass in _id: req.params.id 
deletePizza({ params }, res) {
    Pizza.findOneAndDelete({ _id: params.id })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.status(400).json(err));
  }

}

//So now that we have the five main CRUD methods for the /api/pizzas endpoint routes, let's create the routes and hook these methods up to them!

module.exports = pizzaController;