const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const express = require("express");
const router = express.Router();
const validator = require('../middleware/validate');
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
    const movies = await Movie.find().sort("title");
    res.send(movies);
});

router.get("/:id", validateObjectId, async (req, res) => {
    const movie = await Movie.findById(req.params.id);

    if (!movie)
        return res.status(404).send("The movie with the given ID was not found.");

    res.send(movie);
});

router.put("/:id", [validateObjectId, validator(validate)], async (req, res) => {
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(404).send("Invalid genre.");

    const { title, numberInStock, dailyRentalRate } = req.body;
    const movie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
            title,
            genre: { _id: genre._id, name: genre.name },
            numberInStock,
            dailyRentalRate,
        },
        { new: true }
    );

    if (!movie)
        return res.status(404).send("The movie with the given ID was not found.");

    res.send(movie);
});

router.post("/", validator(validate), async (req, res) => {
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genre");

    const { title, dailyRentalRate, numberInStock } = req.body;
    const movie = new Movie({
        title,
        genre: { _id: genre.id, name: genre.name },
        dailyRentalRate,
        numberInStock,
    });
    await movie.save();

    res.send(movie);
});

router.delete("/:id", [auth, validateObjectId], async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);

    if (!movie)
        return res.status(404).send("The movie with the given ID was not found.");

    res.send(movie);
});

module.exports = router;
