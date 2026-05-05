const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth.middleware');
const { getCitas, createCita, updateEstadoCita, updateCita, deleteCita } = require('../controllers/cita.controller');

router.get('/', verifyToken, getCitas);
router.post('/', verifyToken, createCita);
router.put('/:id', verifyToken, updateCita);
router.patch('/:id/estado', verifyToken, updateEstadoCita);
router.delete('/:id', verifyToken, deleteCita);

module.exports = router;
