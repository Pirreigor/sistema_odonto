const pool = require('../config/db');

// GET /api/servicios
const getServicios = async (req, res) => {
  try {
    const { clinica_id } = req.user;

    const [rows] = await pool.query(
      `SELECT * FROM servicios WHERE clinica_id = ? ORDER BY nombre`,
      [clinica_id]
    );

    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// POST /api/servicios
const createServicio = async (req, res) => {
  try {
    const { clinica_id } = req.user;
    const { nombre, descripcion, duracion_minutos, precio } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: 'El nombre del servicio es obligatorio' });
    }

    const [result] = await pool.query(
      `INSERT INTO servicios (clinica_id, nombre, descripcion, duracion_minutos, precio)
       VALUES (?, ?, ?, ?, ?)`,
      [clinica_id, nombre, descripcion || null, duracion_minutos || 30, precio || 0]
    );

    return res.status(201).json({ message: 'Servicio creado correctamente', servicioId: result.insertId });
  } catch (error) {
    console.error('Error al crear servicio:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// PUT /api/servicios/:id
const updateServicio = async (req, res) => {
  try {
    const { clinica_id } = req.user;
    const { id } = req.params;
    const { nombre, descripcion, duracion_minutos, precio, estado } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: 'El nombre del servicio es obligatorio' });
    }

    const [result] = await pool.query(
      `UPDATE servicios SET nombre = ?, descripcion = ?, duracion_minutos = ?, precio = ?, estado = ?
       WHERE id = ? AND clinica_id = ?`,
      [nombre, descripcion || null, duracion_minutos || 30, precio || 0, estado ?? 1, id, clinica_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    return res.status(200).json({ message: 'Servicio actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// DELETE /api/servicios/:id
const deleteServicio = async (req, res) => {
  try {
    const { clinica_id } = req.user;
    const { id } = req.params;

    const [result] = await pool.query(
      `DELETE FROM servicios WHERE id = ? AND clinica_id = ?`,
      [id, clinica_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    return res.status(200).json({ message: 'Servicio eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { getServicios, createServicio, updateServicio, deleteServicio };
