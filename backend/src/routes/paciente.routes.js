const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth.middleware');
const {
    getPatients,
    createPatient,
    updatePatient,
    deletePatient
} = require('../controllers/paciente.controller');

router.get('/', verifyToken, getPatients);
router.post('/', verifyToken, createPatient);
router.put('/:id', verifyToken, updatePatient);
router.delete('/:id', verifyToken, deletePatient);

module.exports = router;