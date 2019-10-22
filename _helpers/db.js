const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mydb',{ useNewUrlParser: true });


mongoose.Promise = global.Promise;

module.exports = {
    User: require('../users/user.model')
};
