const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth.middleware');
const { getServicios, createServicio, updateServicio, deleteServicio } = require('../controllers/servicio.controller');

router.get('/', verifyToken, getServicios);
router.post('/', verifyToken, createServicio);
router.put('/:id', verifyToken, updateServicio);
router.delete('/:id', verifyToken, deleteServicio);

module.exports = router;
