const winston = require('winston');
const mongoose = require('mongoose');

const connection = "mongodb://localhost/vidly-api-node";

module.exports = function () {
    mongoose
        .connect(connection)
        .then(() => winston.info("Connected to MongoDB..."));
};
module.exports.connection = connection;