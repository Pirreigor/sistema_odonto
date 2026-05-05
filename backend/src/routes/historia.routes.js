const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth.middleware');
const { getHistoria, upsertHistoria, addDetalle } = require('../controllers/historia.controller');

router.get('/:paciente_id', verifyToken, getHistoria);
router.post('/:paciente_id', verifyToken, upsertHistoria);
router.post('/:paciente_id/detalle', verifyToken, addDetalle);

module.exports = router;
