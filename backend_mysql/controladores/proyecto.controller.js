const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const pryectoService = require('../servicios/proyecto.service');

// routes
router.post('/register', authorize(), registerSchema, register);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function registerSchema(req, res, next) {
    const schema = Joi.object({
        clave: Joi.string().required(),
        cliente: Joi.string().required(),
        monto: Joi.number().precision(2).required(),
        tipo: Joi.number().required(),
        ot: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    pryectoService.create(req.body)
        .then(() => res.json({ message: 'Registro exitoso' }))
        .catch(next);
}

function getAll(req, res, next) {
    pryectoService.getAll()
        .then(pryectos => res.json(pryectos))
        .catch(next);
}

function getById(req, res, next) {
    pryectoService.getById(req.params.id)
        .then(pryecto => res.json(pryecto))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        clave: Joi.string().empty(''),
        cliente: Joi.string().empty(''),
        monto: Joi.number(),
        tipo: Joi.number(),
        ot: Joi.string().empty(''),
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    pryectoService.update(req.params.id, req.body)
        .then(pryecto => res.json(pryecto))
        .catch(next);
}

function _delete(req, res, next) {
    pryectoService.delete(req.params.id)
        .then(() => res.json({ message: 'Proyecto borrado correctamente' }))
        .catch(next);
}