const Joi = require('joi');
const mongoose = require('mongoose');
const moment = require('moment');

const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                maxlength: 50,
                minlength: 5,
                required: true,
                type: String,
            },
            isGold: {
                default: false,
                type: Boolean,
            },
            phone: {
                required: true,
                type: String,
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                maxlength: 255,
                minlength: 5,
                required: true,
                trim: true,
                type: String,
            },
            dailyRentalRate: {
                max: 255,
                min: 0,
                required: true,
                type: Number,
            }
        }),
        required: true
    },
    dateOut: {
        default: Date.now,
        required: true,
        type: Date
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        min: 0,
        type: Number,
    }
});

rentalSchema.statics.lookup = function (customerId, movieId) {
    return this.findOne({
        "customer._id": customerId,
        "movie._id": movieId,
    });
};

rentalSchema.methods.return = function () {
    this.dateReturned = new Date();

    const rentalDays = moment().diff(this.dateOut, "days");
    this.rentalFee = rentalDays * this.movie.dailyRentalRate;
};

const Rental = mongoose.model("Rental", rentalSchema);

function validateRental(rental) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
    });

    return schema.validate(rental);
}

module.exports.Rental = Rental;
module.exports.validate = validateRental;
