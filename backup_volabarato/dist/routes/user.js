"use strict";
const express = require('express');
const jwt = require('jsonwebtoken');
const { User, joiSchema } = require('../models/User');
const router = express.Router();
router.post('/register', async (req, res) => {
    const { error } = joiSchema.validate(req.body);
    if (error)
        return res.status(400).send(error.details.message);
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
});
router.post('/login', async (req, res) => {
    const { usuario, password } = req.body;
    const user = await User.findOne({ usuario });
    if (!user)
        return res.status(401).json({ error: 'Credenciales inválidas' });
    const valid = require('bcrypt').compareSync(password, user.password);
    if (!valid)
        return res.status(401).json({ error: 'Credenciales inválidas' });
    const token = jwt.sign({ _id: user._id, usuario: user.usuario }, process.env.JWT_SECRET);
    res.json({ token });
});
module.exports = router;
//# sourceMappingURL=user.js.map