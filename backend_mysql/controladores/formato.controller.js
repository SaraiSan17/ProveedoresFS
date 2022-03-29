const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const formatoService = require('../servicios/formato.service');

// routes
router.post('/register', authorize(), registerSchema, register);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function registerSchema(req, res, next) {
    const schema = Joi.object({
        nombre: Joi.string().required(),
        estatus: Joi.number().required()
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    formatoService.create(req.body)
        .then(() => res.json({ message: 'Registro exitoso' }))
        .catch(next);
}

function getAll(req, res, next) {
    formatoService.getAll()
        .then(formatos => res.json(formatos))
        .catch(next);
}

function getById(req, res, next) {
    formatoService.getById(req.params.id)
        .then(formato => res.json(formato))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        nombre: Joi.string().empty(''),
        estatus: Joi.number()
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    formatoService.update(req.params.id, req.body)
        .then(formato => res.json(formato))
        .catch(next);
}

function _delete(req, res, next) {
    formatoService.delete(req.params.id)
        .then(() => res.json({ message: 'Formato borrado correctamente' }))
        .catch(next);
}