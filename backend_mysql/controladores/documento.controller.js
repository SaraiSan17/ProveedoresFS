const express = require('express');
const config = require('config.json');
//const multer = require('multer');
const path = require('path');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const documentoService = require('../servicios/documento.service');

// routes
router.post('/register', authorize(),  register);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function registerSchema(req, res, next) {
    const schema = Joi.object({
        proyecto_id: Joi.number().required(),
        formato_id: Joi.number().required(),
        cliente_id: Joi.number().required(),
        comentarios: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    
    console.log("tyoe",req.get('Content-Type'));
    console.log("BODY",req.formData);

    
    return;
    documentoService.create(req.body)
        .then(() => res.json({ message: 'Registro exitoso' }))
        .catch(next);
}

function getAll(req, res, next) {
    documentoService.getAll()
        .then(documentos => res.json(documentos))
        .catch(next);
}

function getById(req, res, next) {
    documentoService.getById(req.params.id)
        .then(documento => res.json(documento))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        proyecto_id: Joi.number(),
        formato_id: Joi.number(),
        cliente_id: Joi.number(),
        comentarios: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    documentoService.update(req.params.id, req.body)
        .then(documento => res.json(documento))
        .catch(next);
}

function _delete(req, res, next) {
    documentoService.delete(req.params.id)
        .then(() => res.json({ message: 'Documento borrado correctamente' }))
        .catch(next);
}