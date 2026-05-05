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
        u.nombre,
        u.apellido,
        u.email,
        u.clave,
        u.estado,
        u.clinica_id,
        r.nombre AS rol,
        c.nombre AS clinica_nombre
      FROM usuarios u
      INNER JOIN roles r ON u.rol_id = r.id
      INNER JOIN clinicas c ON u.clinica_id = c.id
      WHERE u.email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: 'Credenciales incorrectas'
      });
    }

    const user = rows[0];

    if (user.estado !== 1) {
      return res.status(403).json({
        message: 'Usuario inactivo'
      });
    }

    const isMatch = await bcrypt.compare(password, user.clave);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Credenciales incorrectas'
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        clinica_id: user.clinica_id,
        rol: user.rol
    },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
    );

    return res.status(200).json({
    message: 'Inicio de sesión exitoso',
    token,
        user: {
            id: user.id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            rol: user.rol,
            clinica_id: user.clinica_id
        },
        clinica: {
        id: user.clinica_id,
        nombre: user.clinica_nombre
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