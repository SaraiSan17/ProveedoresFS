const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const clienteService = require('../servicios/cliente.service');

// routes
router.post('/register', authorize(), registerSchema, register);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function registerSchema(req, res, next) {
    const schema = Joi.object({
        direccion: Joi.string().required(),
        razon_social: Joi.string().required(),
        rfc: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    clienteService.create(req.body)
        .then(() => res.json({ message: 'Registro exitoso' }))
        .catch(next);
}

function getAll(req, res, next) {
    clienteService.getAll()
        .then(clientes => res.json(clientes))
        .catch(next);
}

function getById(req, res, next) {
    clienteService.getById(req.params.id)
        .then(cliente => res.json(cliente))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        direccion: Joi.string().empty(''),
        razon_social: Joi.string().empty(''),
        rfc: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    clienteService.update(req.params.id, req.body)
        .then(cliente => res.json(cliente))
        .catch(next);
}

function _delete(req, res, next) {
    clienteService.delete(req.params.id)
        .then(() => res.json({ message: 'Cliente borrado correctamente' }))
        .catch(next);
}