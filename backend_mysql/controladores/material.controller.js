const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const materialService = require('../servicios/material.service');

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
        cantidad: Joi.number().precision(2).required(),
        unidad: Joi.string().required(),
        descripcion: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    materialService.create(req.body)
        .then(() => res.json({ message: 'Registro exitoso' }))
        .catch(next);
}

function getAll(req, res, next) {
    materialService.getAll()
        .then(materials => res.json(materials))
        .catch(next);
}

function getById(req, res, next) {
    materialService.getById(req.params.id)
        .then(material => res.json(material))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        clave: Joi.string().empty(''),
        cantidad: Joi.number().precision(2),
        unidad: Joi.string().empty(''),
        descripcion: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    materialService.update(req.params.id, req.body)
        .then(material => res.json(material))
        .catch(next);
}

function _delete(req, res, next) {
    materialService.delete(req.params.id)
        .then(() => res.json({ message: 'Material borrado correctamente' }))
        .catch(next);
}