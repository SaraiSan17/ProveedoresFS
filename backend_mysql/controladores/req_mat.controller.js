const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const reqMatService = require('../servicios/req_mat.service');

// routes
router.get('/:id', authorize(), getAll);

module.exports = router;

function getAll(req, res, next) {
    reqMatService.getAll(req.params.id)
        .then(reqMats => res.json(reqMats))
        .catch(next);
}
