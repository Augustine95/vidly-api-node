const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();
const _ = require('lodash');

router.get('/me', async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    res.send(user);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already exist.");

    user = new User(_.pick(req.body, ['password', 'email', 'name']));
    await user.save();

    res.send(_.pick(req.body, ['_id', 'email', 'name']));
});

module.exports = router;