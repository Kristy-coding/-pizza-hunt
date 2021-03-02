//Again, like you did with Sequelize, you'll create a file in the models directory that will package up all of the models. Even though currently you have just one, you should set yourself up for future additions.

const Pizza = require('./Pizza');
const Comment = require('./Comment');

module.exports = { Pizza, Comment };
