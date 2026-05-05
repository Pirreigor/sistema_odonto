const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth.middleware');
const { getSedes, createSede, updateSede, deleteSede } = require('../controllers/sede.controller');

router.get('/', verifyToken, getSedes);
router.post('/', verifyToken, createSede);
router.put('/:id', verifyToken, updateSede);
router.delete('/:id', verifyToken, deleteSede);

module.exports = router;
