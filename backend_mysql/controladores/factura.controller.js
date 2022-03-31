const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const facturaService = require('../servicios/factura.service');

// routes
router.post('/register', authorize(), registerSchema, register);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function registerSchema(req, res, next) {
    const schema = Joi.object({
        proveedor_id: Joi.number().required(),
        proyecto_id: Joi.number().required(),
        moneda_id: Joi.number().required(),
        folio: Joi.string().required(),
        fecha_factura: Joi.date().required(),
        subtotal: Joi.number().required(),
        iva: Joi.number().required(),
        total: Joi.number().required(),
        tipo_factura: Joi.number().required(),
        orden_compra: Joi.string().required(),
        requisicion_id: Joi.number().required(),
        comentarios: Joi.string().required(),
        xml: Joi.any().required()
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    
    facturaService.create(req.body)
        .then((data) => {
            res.json({ message: 'Registro exitoso', value:data })
        })
        .catch(next);
}

function getAll(req, res, next) {
    facturaService.getAll()
        .then(facturas => res.json(facturas))
        .catch(next);
}

function getById(req, res, next) {
    facturaService.getById(req.params.id)
        .then(factura => res.json(factura))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        proveedor_id: Joi.number(),
        proyecto_id: Joi.number(),
        moneda_id: Joi.number(),
        folio: Joi.string().empty(''),
        fecha_factura: Joi.date(),
        subtotal: Joi.number(),
        iva: Joi.number(),
        total: Joi.number(),
        tipo_factura: Joi.number(),
        orden_compra: Joi.string().empty(''),
        requisicion_id: Joi.number(),
        comentarios: Joi.string().empty(''),
        xml: Joi.any().required()
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    facturaService.update(req.params.id, req.body)
        .then((data) => {
            res.json({ message: 'Registro exitoso', fac: data })
        })
        .catch(next);
}

function _delete(req, res, next) {
    facturaService.delete(req.params.id)
        .then(() => res.json({ message: 'factura borrada correctamente' }))
        .catch(next);
}