const pool = require('../config/db');

// GET /api/historia/:paciente_id
const getHistoria = async (req, res) => {
  try {
    const { clinica_id } = req.user;
    const { paciente_id } = req.params;

    const [[historia]] = await pool.query(
      `SELECT h.*, p.nombre AS paciente_nombre, p.apellido AS paciente_apellido, p.dni
       FROM historia_clinica h
       INNER JOIN pacientes p ON h.paciente_id = p.id
       WHERE h.paciente_id = ? AND h.clinica_id = ?`,
      [paciente_id, clinica_id]
    );

    if (!historia) {
      return res.status(404).json({ message: 'Historia clínica no encontrada' });
    }

    const [detalles] = await pool.query(
      `SELECT hcd.*, 
        u.nombre AS doctor_nombre, u.apellido AS doctor_apellido,
        se.nombre AS sede_nombre
       FROM historia_clinica_detalle hcd
       INNER JOIN usuarios u ON hcd.doctor_id = u.id
       INNER JOIN sedes se ON hcd.sede_id = se.id
       WHERE hcd.historia_id = ?
       ORDER BY hcd.fecha_atencion DESC`,
      [historia.id]
    );

    return res.status(200).json({ ...historia, detalles });
  } catch (error) {
    console.error('Error al obtener historia clínica:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// POST /api/historia/:paciente_id  (crea o actualiza la historia base)
const upsertHistoria = async (req, res) => {
  try {
    const { clinica_id } = req.user;
    const { paciente_id } = req.params;
    const { alergias, enfermedades_base, medicamentos_actuales, grupo_sanguineo, observaciones_generales } = req.body;

    await pool.query(
      `INSERT INTO historia_clinica (paciente_id, clinica_id, alergias, enfermedades_base, medicamentos_actuales, grupo_sanguineo, observaciones_generales)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         alergias = VALUES(alergias),
         enfermedades_base = VALUES(enfermedades_base),
         medicamentos_actuales = VALUES(medicamentos_actuales),
         grupo_sanguineo = VALUES(grupo_sanguineo),
         observaciones_generales = VALUES(observaciones_generales)`,
      [paciente_id, clinica_id, alergias || null, enfermedades_base || null, medicamentos_actuales || null, grupo_sanguineo || null, observaciones_generales || null]
    );

    return res.status(200).json({ message: 'Historia clínica guardada correctamente' });
  } catch (error) {
    console.error('Error al guardar historia clínica:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// POST /api/historia/:paciente_id/detalle  (agrega una atención)
const addDetalle = async (req, res) => {
  try {
    const { clinica_id, id: doctor_id } = req.user;
    const { paciente_id } = req.params;
    const { sede_id, cita_id, fecha_atencion, motivo_consulta, diagnostico, tratamiento_realizado, observaciones } = req.body;

    if (!sede_id || !fecha_atencion) {
      return res.status(400).json({ message: 'sede y fecha de atención son obligatorios' });
    }

    // Obtener o crear la historia base
    let [[historia]] = await pool.query(
      `SELECT id FROM historia_clinica WHERE paciente_id = ? AND clinica_id = ?`,
      [paciente_id, clinica_id]
    );

    if (!historia) {
      const [r] = await pool.query(
        `INSERT INTO historia_clinica (paciente_id, clinica_id) VALUES (?, ?)`,
        [paciente_id, clinica_id]
      );
      historia = { id: r.insertId };
    }

    const [result] = await pool.query(
      `INSERT INTO historia_clinica_detalle (historia_id, sede_id, doctor_id, cita_id, fecha_atencion, motivo_consulta, diagnostico, tratamiento_realizado, observaciones)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [historia.id, sede_id, doctor_id, cita_id || null, fecha_atencion, motivo_consulta || null, diagnostico || null, tratamiento_realizado || null, observaciones || null]
    );

    return res.status(201).json({ message: 'Atención registrada correctamente', detalleId: result.insertId });
  } catch (error) {
    console.error('Error al registrar atención:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { getHistoria, upsertHistoria, addDetalle };
