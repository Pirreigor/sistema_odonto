const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Correo y contraseña son obligatorios'
      });
    }

    const [rows] = await pool.query(
      `SELECT 
        u.id,
        u.name,
        u.lastname,
        u.email,
        u.password,
        u.status,
        u.clinic_id,
        r.name AS role,
        c.name AS clinic_name
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
      INNER JOIN clinics c ON u.clinic_id = c.id
      WHERE u.email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: 'Credenciales incorrectas'
      });
    }

    const user = rows[0];

    if (user.status !== 1) {
      return res.status(403).json({
        message: 'Usuario inactivo'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Credenciales incorrectas'
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        clinic_id: user.clinic_id,
        role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
    );

    return res.status(200).json({
    message: 'Inicio de sesión exitoso',
    token,
        user: {
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            role: user.role,
            clinic_id: user.clinic_id
        },
        clinic: {
        id: user.clinic_id,
        name: user.clinic_name
        }
    });
    } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({
        message: 'Error interno del servidor'
    });
    }
};

module.exports = {
    login
};