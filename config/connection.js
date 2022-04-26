const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(
    process.env.MONGODB_STRING,
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }
);

// creates a global instance of mongoose to connect to my db. We are exporting this connection. It is asynchronous, so in our server code we first connect to the db, then fire up the server after it has connected.
module.exports = mongoose.connection;
