const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const requisicionService = require('../servicios/requisicion.service');
const reqMatService = require('../servicios/req_mat.service');

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
        liquidacion: Joi.number().required(),
        proyecto_id: Joi.number().required(),
        fecha_solicitud: Joi.date().required(),
        fecha_requerida: Joi.date().required(),
        autorizado_por: Joi.string().required(),
        lugar_entrega: Joi.string().required(),
        descripcion: Joi.string().required(),
        materiales: Joi.array().required()
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    
    let idsMats = []; 
    req.body.materiales.forEach(element => {
        idsMats.push(element)
    });
    requisicionService.create(req.body)
        .then((data) => {
            console.log("ID REQUISICION",data.dataValues.id)
            idsMats.forEach(el => {
                reqMatService.create({
                    requisicion_id: data.dataValues.id,
                    material_id: el.id,
                    cantidad: el.mCantidad,
                    notas: el.mNotas
                }).then(() => {
                    console.log("REFERENCIA GUARDADA")
                }).catch(fail => console.log("FAIL REQ MAT",fail));
            })
            res.json({ message: 'Registro exitoso', value:data })
        })
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
        liquidacion: Joi.number(),
        proyecto_id: Joi.number(),
        fecha_solicitud: Joi.date(),
        fecha_requerida: Joi.date(),
        autorizado_por: Joi.string().empty(''),
        lugar_entrega: Joi.string().empty(''),
        descripcion: Joi.string().empty(''),
        materiales: Joi.array()
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {

    let idsMats = []; 
    req.body.materiales.forEach(element => {
        idsMats.push(element)
    });
    console.log("Materiales",idsMats);
    reqMatService.deleteRefs(req.params.id).then(() => {
        console.log("REFERENCIASBORRADAS")
    })
    requisicionService.update(req.params.id, req.body)
        .then((data) => {
            console.log("ID REQUISICION",data.id)
            idsMats.forEach(el => {
                reqMatService.create({
                    requisicion_id: data.id,
                    material_id: el.id,
                    cantidad: el.mCantidad,
                    notas: el.mNotas
                }).then(() => {
                    console.log("REFERENCIA GUARDADA update")
                }).catch(fail => console.log("FAIL REQ MAT",fail));
            })
            res.json({ message: 'Registro exitoso' })
        })
        .catch(next);
}

function _delete(req, res, next) {
    requisicionService.delete(req.params.id)
        .then(() => res.json({ message: 'requisicion borrada correctamente' }))
        .catch(next);
}