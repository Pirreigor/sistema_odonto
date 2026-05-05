const pool = require('../config/db');

const getPatients = async (req, res) => {
  try {
    const clinicId = req.user.clinic_id;

    const [rows] = await pool.query(
      `SELECT id, dni, name, lastname, birth_date, gender, phone, email, address, medical_notes, status, created_at
      FROM patients
      WHERE clinic_id = ?
      ORDER BY id DESC`,
      [clinicId]
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
    const clinicId = req.user.clinic_id;

    const {
      dni,
      name,
      lastname,
      birth_date,
      gender,
      phone,
      email,
      address,
      medical_notes
    } = req.body;

    if (!name) {
      return res.status(400).json({
        message: 'El nombre del paciente es obligatorio'
      });
    }

    const [result] = await pool.query(
      `INSERT INTO patients 
      (clinic_id, dni, name, lastname, birth_date, gender, phone, email, address, medical_notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        clinicId,
        dni || null,
        name,
        lastname || null,
        birth_date || null,
        gender || null,
        phone || null,
        email || null,
        address || null,
        medical_notes || null
      ]
    );

    return res.status(201).json({
      message: 'Paciente registrado correctamente',
      patientId: result.insertId
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
    const clinicId = req.user.clinic_id;
    const { id } = req.params;

    const {
      dni,
      name,
      lastname,
      birth_date,
      gender,
      phone,
      email,
      address,
      medical_notes
    } = req.body;

    if (!name) {
      return res.status(400).json({
        message: 'El nombre del paciente es obligatorio'
      });
    }

    const [result] = await pool.query(
      `UPDATE patients
      SET dni = ?, name = ?, lastname = ?, birth_date = ?, gender = ?, phone = ?, email = ?, address = ?, medical_notes = ?
      WHERE id = ? AND clinic_id = ?`,
      [
        dni || null,
        name,
        lastname || null,
        birth_date || null,
        gender || null,
        phone || null,
        email || null,
        address || null,
        medical_notes || null,
        id,
        clinicId
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
    const clinicId = req.user.clinic_id;
    const { id } = req.params;

    const [result] = await pool.query(
      `DELETE FROM patients
      WHERE id = ? AND clinic_id = ?`,
      [id, clinicId]
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