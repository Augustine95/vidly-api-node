const mongoose = require('mongoose');
const express = require('express');
const app = express();
const genres = require('./routes/genres');
const movies = require('./routes/movies');

mongoose.connect('mongodb://localhost/vidly-api-node')
    .then(() => console.log("Connected to MongoDB..."))
    .catch(err => console.log("Failed to connect to the MongoDB...", err));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/movies', movies);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));