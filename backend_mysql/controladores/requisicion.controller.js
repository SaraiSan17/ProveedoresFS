const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const requisicionService = require('../servicios/requisicion.service');

// routes
router.post('/register', authorize(), registerSchema, register);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function registerSchema(req, res, next) {
    const schema = Joi.object({
        numero: Joi.string().required(),
        solicitado_por: Joi.string().required(),
        liquidacion: Joi.numero().required(),
        proyecto_id: Joi.number().required(),
        fecha_solicitud: Joi.date().required(),
        fecha_requerida: Joi.date().required(),
        autorizado_por: Joi.string().required(),
        lugar_entrega: Joi.string().required(),
        descripcion: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    requisicionService.create(req.body)
        .then(() => res.json({ message: 'Registro exitoso' }))
        .catch(next);
}

function getAll(req, res, next) {
    requisicionService.getAll()
        .then(requisicions => res.json(requisicions))
        .catch(next);
}

function getById(req, res, next) {
    requisicionService.getById(req.params.id)
        .then(requisicion => res.json(requisicion))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        numero: Joi.string().empty(''),
        solicitado_por: Joi.string().empty(''),
        liquidacion: Joi.numero(),
        proyecto_id: Joi.number(),
        fecha_solicitud: Joi.date(),
        fecha_requerida: Joi.date(),
        autorizado_por: Joi.string().empty(''),
        lugar_entrega: Joi.string().empty(''),
        descripcion: Joi.string().empoty(''),
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    requisicionService.update(req.params.id, req.body)
        .then(requisicion => res.json(requisicion))
        .catch(next);
}

function _delete(req, res, next) {
    requisicionService.delete(req.params.id)
        .then(() => res.json({ message: 'requisicion borrada correctamente' }))
        .catch(next);
}