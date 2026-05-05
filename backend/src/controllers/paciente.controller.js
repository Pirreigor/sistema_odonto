const pool = require('../config/db');

const getPatients = async (req, res) => {
  try {
    const clinicaId = req.user.clinica_id;

    const [rows] = await pool.query(
      `SELECT id, dni, nombre, apellido, fecha_nacimiento, genero, telefono, email, direccion, notas_medicas, estado, created_at
      FROM pacientes
      WHERE clinica_id = ?
      ORDER BY id DESC`,
      [clinicaId]
    );

    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    return res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};

const createPatient = async (req, res) => {
  try {
    const clinicaId = req.user.clinica_id;

    const {
      dni,
      nombre,
      apellido,
      fecha_nacimiento,
      genero,
      telefono,
      email,
      direccion,
      notas_medicas
    } = req.body;

    if (!nombre) {
      return res.status(400).json({
        message: 'El nombre del paciente es obligatorio'
      });
    }

    const [result] = await pool.query(
      `INSERT INTO pacientes 
      (clinica_id, dni, nombre, apellido, fecha_nacimiento, genero, telefono, email, direccion, notas_medicas)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        clinicaId,
        dni || null,
        nombre,
        apellido || null,
        fecha_nacimiento || null,
        genero || null,
        telefono || null,
        email || null,
        direccion || null,
        notas_medicas || null
      ]
    );

    return res.status(201).json({
      message: 'Paciente registrado correctamente',
      pacienteId: result.insertId
    });
  } catch (error) {
    console.error('Error al crear paciente:', error);
    return res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};

const updatePatient = async (req, res) => {
  try {
    const clinicaId = req.user.clinica_id;
    const { id } = req.params;

    const {
      dni,
      nombre,
      apellido,
      fecha_nacimiento,
      genero,
      telefono,
      email,
      direccion,
      notas_medicas
    } = req.body;

    if (!nombre) {
      return res.status(400).json({
        message: 'El nombre del paciente es obligatorio'
      });
    }

    const [result] = await pool.query(
      `UPDATE pacientes
      SET dni = ?, nombre = ?, apellido = ?, fecha_nacimiento = ?, genero = ?, telefono = ?, email = ?, direccion = ?, notas_medicas = ?
      WHERE id = ? AND clinica_id = ?`,
      [
        dni || null,
        nombre,
        apellido || null,
        fecha_nacimiento || null,
        genero || null,
        telefono || null,
        email || null,
        direccion || null,
        notas_medicas || null,
        id,
        clinicaId
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Paciente no encontrado'
      });
    }

    return res.status(200).json({
      message: 'Paciente actualizado correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    return res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};

const deletePatient = async (req, res) => {
  try {
    const clinicaId = req.user.clinica_id;
    const { id } = req.params;

    const [result] = await pool.query(
      `DELETE FROM pacientes
      WHERE id = ? AND clinica_id = ?`,
      [id, clinicaId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Paciente no encontrado'
      });
    }

    return res.status(200).json({
      message: 'Paciente eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar paciente:', error);
    return res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getPatients,
  createPatient,
  updatePatient,
  deletePatient
};