"use strict";
const express = require('express');
const { Paquete, joiSchema } = require('../models/Paquete');
const auth = require('../middlewares/auth');
const router = express.Router();
router.get('/', async (req, res) => {
    const paquetes = await Paquete.find({ activo: true });
    res.json(paquetes);
});
router.post('/', auth, async (req, res) => {
    const { error } = joiSchema.validate(req.body);
    if (error)
        return res.status(400).send(error.details.message);
    const paquete = new Paquete(req.body);
    await paquete.save();
    res.status(201).json(paquete);
});
router.put('/:id', auth, async (req, res) => {
    const { error } = joiSchema.validate(req.body);
    if (error)
        return res.status(400).send(error.details.message);
    const paquete = await Paquete.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(paquete);
});
router.delete('/:id', auth, async (req, res) => {
    await Paquete.findByIdAndUpdate(req.params.id, { activo: false });
    res.status(200).json({ message: 'Baja lógica realizada.' });
});
module.exports = router;
//# sourceMappingURL=paquete.js.map