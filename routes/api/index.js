//This file will import all of the API routes to prefix their endpoint names and package them up

const router = require('express').Router();
const pizzaRoutes = require('./pizza-routes');

// add prefix of `/pizzas` to routes created in `pizza-routes.js`
router.use('/pizzas', pizzaRoutes);

module.exports = router;
//Lastly, let's navigate to the /routes/index.js file to import the API routes and set them up.