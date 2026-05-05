const pool = require('../config/db');

// GET /api/sedes
const getSedes = async (req, res) => {
  try {
    const { clinica_id, rol } = req.user;

    let rows;
    if (rol === 'super_admin') {
      [rows] = await pool.query(
        `SELECT s.*, c.nombre AS clinica_nombre
         FROM sedes s
         INNER JOIN clinicas c ON s.clinica_id = c.id
         ORDER BY c.nombre, s.nombre`
      );
    } else {
      [rows] = await pool.query(
        `SELECT s.*, c.nombre AS clinica_nombre
         FROM sedes s
         INNER JOIN clinicas c ON s.clinica_id = c.id
         WHERE s.clinica_id = ?
         ORDER BY s.nombre`,
        [clinica_id]
      );
    }

    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener sedes:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// POST /api/sedes
const createSede = async (req, res) => {
  try {
    const { clinica_id, rol } = req.user;
    const { nombre, direccion, telefono, email } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: 'El nombre de la sede es obligatorio' });
    }

    // Solo super_admin puede indicar otra clinica_id
    const targetClinicaId = rol === 'super_admin' && req.body.clinica_id
      ? req.body.clinica_id
      : clinica_id;

    const [result] = await pool.query(
      `INSERT INTO sedes (clinica_id, nombre, direccion, telefono, email)
       VALUES (?, ?, ?, ?, ?)`,
      [targetClinicaId, nombre, direccion || null, telefono || null, email || null]
    );

    return res.status(201).json({ message: 'Sede creada correctamente', sedeId: result.insertId });
  } catch (error) {
    console.error('Error al crear sede:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// PUT /api/sedes/:id
const updateSede = async (req, res) => {
  try {
    const { clinica_id, rol } = req.user;
    const { id } = req.params;
    const { nombre, direccion, telefono, email, estado } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: 'El nombre de la sede es obligatorio' });
    }

    const whereExtra = rol === 'super_admin' ? '' : 'AND clinica_id = ?';
    const params = rol === 'super_admin'
      ? [nombre, direccion || null, telefono || null, email || null, estado ?? 1, id]
      : [nombre, direccion || null, telefono || null, email || null, estado ?? 1, id, clinica_id];

    const [result] = await pool.query(
      `UPDATE sedes SET nombre = ?, direccion = ?, telefono = ?, email = ?, estado = ?
       WHERE id = ? ${whereExtra}`,
      params
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Sede no encontrada' });
    }

    return res.status(200).json({ message: 'Sede actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar sede:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// DELETE /api/sedes/:id
const deleteSede = async (req, res) => {
  try {
    const { clinica_id, rol } = req.user;
    const { id } = req.params;

    const whereExtra = rol === 'super_admin' ? '' : 'AND clinica_id = ?';
    const params = rol === 'super_admin' ? [id] : [id, clinica_id];

    const [result] = await pool.query(
      `DELETE FROM sedes WHERE id = ? ${whereExtra}`,
      params
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Sede no encontrada' });
    }

    return res.status(200).json({ message: 'Sede eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar sede:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { getSedes, createSede, updateSede, deleteSede };
