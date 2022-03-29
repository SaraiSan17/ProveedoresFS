const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const asignacionService = require('../servicios/asignacion.service');

// routes
router.post('/register', authorize(), registerSchema, register);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function registerSchema(req, res, next) {
    const schema = Joi.object({
        ot: Joi.string().required(),
        proyecto_id: Joi.number().required(),
        cliente_id: Joi.number().required(),
        users_id: Joi.number().required(),
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    asignacionService.create(req.body)
        .then(() => res.json({ message: 'Registro exitoso' }))
        .catch(next);
}

function getAll(req, res, next) {
    asignacionService.getAll()
        .then(asignacions => res.json(asignacions))
        .catch(next);
}

function getById(req, res, next) {
    asignacionService.getById(req.params.id)
        .then(asignacion => res.json(asignacion))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        ot: Joi.string().empty(''),
        proyecto: Joi.number(),
        cliente: Joi.number(),
        proveedor: Joi.number(),
        estatus: Joi.number()
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    asignacionService.update(req.params.id, req.body)
        .then(asignacion => res.json(asignacion))
        .catch(next);
}

function _delete(req, res, next) {
    asignacionService.delete(req.params.id)
        .then(() => res.json({ message: 'Asignacion borrado correctamente' }))
        .catch(next);
}