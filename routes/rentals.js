const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const Fawn = require("fawn");
const config = require('config');
const express = require("express");
const router = express.Router();
const validator = require('../middleware/validate');

Fawn.init(config.get('db'));

router.get("/", async (req, res) => {
    const rentals = await Rental.find().sort("-dateOut");
    res.send(rentals);
});

router.post("/", validator(validate), async (req, res) => {
    let movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send("Invalid movie.");

    let customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send("Invalid customer.");

    if (movie.numberInStock === 0)
        return res.status(400).send("Movie not in stock.");

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate,
        },
    });

    try {
        new Fawn.Task()
            .save("rentals", rental)
            .update(
                "movies",
                { _id: movie._id },
                {
                    $inc: { numberInStock: -1 },
                }
            )
            .run();

        res.send(rental);
    } catch (ex) {
        res.status(500).send("Something failed.")
    }
});

module.exports = router;
