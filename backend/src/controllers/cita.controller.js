const pool = require('../config/db');

// GET /api/citas
const getCitas = async (req, res) => {
  try {
    const { clinica_id, sede_id, rol } = req.user;
    const { fecha, doctor_id } = req.query;

    let where = 'WHERE c.clinica_id = ?';
    let params = [clinica_id];

    // dentista y recepcionista solo ven su sede
    if (['dentista', 'recepcionista', 'asistente'].includes(rol) && sede_id) {
      where += ' AND c.sede_id = ?';
      params.push(sede_id);
    }

    if (fecha) {
      where += ' AND c.fecha = ?';
      params.push(fecha);
    }

    if (doctor_id) {
      where += ' AND c.doctor_id = ?';
      params.push(doctor_id);
    }

    const [rows] = await pool.query(
      `SELECT 
        c.id, c.fecha, c.hora_inicio, c.hora_fin, c.estado, c.notas,
        p.nombre AS paciente_nombre, p.apellido AS paciente_apellido, p.telefono AS paciente_telefono,
        u.nombre AS doctor_nombre, u.apellido AS doctor_apellido,
        s.nombre AS servicio_nombre,
        se.nombre AS sede_nombre
       FROM citas c
       INNER JOIN pacientes p ON c.paciente_id = p.id
       INNER JOIN usuarios u ON c.doctor_id = u.id
       LEFT JOIN servicios s ON c.servicio_id = s.id
       INNER JOIN sedes se ON c.sede_id = se.id
       ${where}
       ORDER BY c.fecha, c.hora_inicio`,
      params
    );

    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener citas:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// POST /api/citas
const createCita = async (req, res) => {
  try {
    const { clinica_id } = req.user;
    const { sede_id, paciente_id, doctor_id, servicio_id, fecha, hora_inicio, hora_fin, notas } = req.body;

    if (!sede_id || !paciente_id || !doctor_id || !fecha || !hora_inicio || !hora_fin) {
      return res.status(400).json({ message: 'sede, paciente, doctor, fecha y horario son obligatorios' });
    }

    // Verificar conflicto de horario
    const [conflicto] = await pool.query(
      `SELECT id FROM citas
       WHERE doctor_id = ? AND fecha = ? AND estado NOT IN ('cancelada','no_asistio')
       AND ((hora_inicio < ? AND hora_fin > ?) OR (hora_inicio < ? AND hora_fin > ?) OR (hora_inicio >= ? AND hora_fin <= ?))`,
      [doctor_id, fecha, hora_fin, hora_inicio, hora_fin, hora_inicio, hora_inicio, hora_fin]
    );

    if (conflicto.length > 0) {
      return res.status(409).json({ message: 'El doctor ya tiene una cita en ese horario' });
    }

    const [result] = await pool.query(
      `INSERT INTO citas (clinica_id, sede_id, paciente_id, doctor_id, servicio_id, fecha, hora_inicio, hora_fin, notas)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [clinica_id, sede_id, paciente_id, doctor_id, servicio_id || null, fecha, hora_inicio, hora_fin, notas || null]
    );

    return res.status(201).json({ message: 'Cita registrada correctamente', citaId: result.insertId });
  } catch (error) {
    console.error('Error al crear cita:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// PUT /api/citas/:id/estado
const updateEstadoCita = async (req, res) => {
  try {
    const { clinica_id } = req.user;
    const { id } = req.params;
    const { estado } = req.body;

    const estadosValidos = ['pendiente', 'confirmada', 'en_atencion', 'completada', 'cancelada', 'no_asistio'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ message: 'Estado no válido' });
    }

    const [result] = await pool.query(
      `UPDATE citas SET estado = ? WHERE id = ? AND clinica_id = ?`,
      [estado, id, clinica_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    return res.status(200).json({ message: 'Estado actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar estado de cita:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// PUT /api/citas/:id
const updateCita = async (req, res) => {
  try {
    const { clinica_id } = req.user;
    const { id } = req.params;
    const { sede_id, paciente_id, doctor_id, servicio_id, fecha, hora_inicio, hora_fin, notas } = req.body;

    if (!sede_id || !paciente_id || !doctor_id || !fecha || !hora_inicio || !hora_fin) {
      return res.status(400).json({ message: 'sede, paciente, doctor, fecha y horario son obligatorios' });
    }

    const [result] = await pool.query(
      `UPDATE citas
       SET sede_id = ?, paciente_id = ?, doctor_id = ?, servicio_id = ?, fecha = ?, hora_inicio = ?, hora_fin = ?, notas = ?
       WHERE id = ? AND clinica_id = ?`,
      [sede_id, paciente_id, doctor_id, servicio_id || null, fecha, hora_inicio, hora_fin, notas || null, id, clinica_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    return res.status(200).json({ message: 'Cita actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar cita:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// DELETE /api/citas/:id
const deleteCita = async (req, res) => {
  try {
    const { clinica_id } = req.user;
    const { id } = req.params;

    const [result] = await pool.query(
      `DELETE FROM citas WHERE id = ? AND clinica_id = ?`,
      [id, clinica_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    return res.status(200).json({ message: 'Cita eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar cita:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { getCitas, createCita, updateEstadoCita, updateCita, deleteCita };
