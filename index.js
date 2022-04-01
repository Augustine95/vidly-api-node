require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const error = require('./middleware/error');
const config = require('config');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const customers = require('./routes/customers');
const genres = require('./routes/genres');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const { dbConnection } = require('./config/config.json');

process.on('uncaughtException', ex => {
    console.log("WE GOT UNCAUGHT EXCEPTION");
    winston.error(ex.message, ex);
});

winston.add(winston.transports.File, { filename: 'test.log' });
winston.add(winston.transports.MongoDB, { db: dbConnection });

throw new Error("Something failed during the startup.");

if (!config.get('jwtPrivateKey')) {
    console.error("FATAL ERROR: jwtPrivateKey is not defined.");
    process.exit(1);
}

mongoose.connect(dbConnection)
    .then(() => console.log("Connected to MongoDB..."))
    .catch(err => console.log("Failed to connect to the MongoDB...", err));

app.use(express.json());
app.use('/api/auth', auth);
app.use('/api/genres', genres);
app.use('/api/movies', movies);
app.use('/api/users', users);
app.use('/api/rentals', rentals);
app.use('/api/customers', customers);
app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));