//Let's set up Mongoose to connect when we start the app. Navigate to server.js and import Mongoose at the top of the file with the following code:

const mongoose = require('mongoose');

const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(require('./routes'));



// mongoose.connect() tells Mongoose which database we want to connect to. If the environment variable MONGODB_URI exists, like on Heroku when we deploy later, it will use that. Otherwise, it will short-circuit to the local MongoDB server's database at mongodb://localhost/pizza-hunt. The second argument in the example is a set of configuration options Mongoose asks for more information about.

//But wait, did we create a database called pizza-hunt? What happens if Mongoose connects to a database that isn't there? No worries—MongoDB will find and connect to the database if it exists or create the database if it doesn't

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/pizza-hunt', {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Use this to log mongo queries being executed!
mongoose.set('debug', true);


app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));
