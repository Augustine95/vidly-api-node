const auth = require('../middleware/auth');
const { Customer, validate } = require("../models/customer");
const express = require("express");
const router = express.Router();
const _ = require("lodash");

router.get("/", async (req, res) => {
    const customers = await Customer.find().sort("-dateOut");
    res.send(customers);
});

router.get("/:id", async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    if (!customer)
        return res
            .status(400)
            .send("The customer with the given ID was not found.");

    res.send(customer);
});

router.put("/:id", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(
        req.params.id,
        _.pick(req.body, ["name", "isGold", "phone"]),
        { new: true }
    );

    if (!customer)
        return res
            .status(400)
            .send("The customer with the given ID was not found.");

    await customer.save();

    res.send(customer);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = new Customer(_.pick(req.body, ['name', 'phone', 'isGold']));
    await customer.save();

    res.send(customer);
});

router.delete('/:id', auth, async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    if (!customer) return res.status(400).send("The user with the given ID was not found.")

    res.send(customer);
});

module.exports = router;
