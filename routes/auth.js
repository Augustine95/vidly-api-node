const asyncMiddleware = require('../middleware/async');
const Joi = require('joi');
const _ = require('lodash');
const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

router.get('/me', asyncMiddleware(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    res.send(user);
}));

router.post('/', asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password.");

    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPassword) return res.status(400).send("Invalid email or password.");

    const token = user.generateAuthToken();
    res.send(token);
}));

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required(),
    });

    return schema.validate(req);
}

module.exports = router;