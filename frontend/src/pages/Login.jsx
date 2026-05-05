import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', form);
      login(response.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Correo o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Panel izquierdo decorativo */}
      <div style={styles.leftPanel}>
        <div style={styles.brandBox}>
          <div style={styles.logoCircle}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8 2 5 5 5 9c0 2.5 1 4.5 2.5 6L9 21h6l1.5-6C18 13.5 19 11.5 19 9c0-4-3-7-7-7z" fill="white" opacity="0.9"/>
              <path d="M9 21h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 style={styles.brandTitle}>OdontoSystem</h1>
          <p style={styles.brandSubtitle}>Gestión dental inteligente</p>
          <div style={styles.featureList}>
            {['Gestión multi-clínica', 'Agenda de citas', 'Historia clínica', 'Reportes en tiempo real'].map(f => (
              <div key={f} style={styles.featureItem}>
                <span style={styles.featureDot}>✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel derecho - formulario */}
      <div style={styles.rightPanel}>
        <div style={styles.formWrapper}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Bienvenido</h2>
            <p style={styles.formSubtitle}>Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Correo electrónico</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>✉</span>
                <input
                  type="email"
                  name="email"
                  placeholder="tu@correo.com"
                  value={form.email}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Contraseña</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <span>⚠ {error}</span>
              </div>
            )}

            <button type="submit" style={loading ? styles.buttonLoading : styles.button} disabled={loading}>
              {loading ? (
                <span>Verificando...</span>
              ) : (
                <span>Iniciar sesión →</span>
              )}
            </button>
          </form>

          <p style={styles.footer}>Sistema Odontológico © 2026</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  leftPanel: {
    flex: 1,
    background: 'linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #2196f3 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
  },
  brandBox: {
    color: '#fff',
    maxWidth: '360px',
  },
  logoCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
    border: '2px solid rgba(255,255,255,0.3)',
  },
  brandTitle: {
    fontSize: '32px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    letterSpacing: '-0.5px',
  },
  brandSubtitle: {
    fontSize: '16px',
    opacity: 0.8,
    margin: '0 0 40px 0',
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '15px',
    opacity: 0.9,
  },
  featureDot: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    flexShrink: 0,
  },
  rightPanel: {
    width: '480px',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
  },
  formWrapper: {
    width: '100%',
    maxWidth: '380px',
  },
  formHeader: {
    marginBottom: '32px',
  },
  formTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 8px 0',
  },
  formSubtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    fontSize: '15px',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '12px 40px 12px 42px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    backgroundColor: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
    color: '#0f172a',
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '2px',
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#dc2626',
    fontSize: '13px',
  },
  button: {
    padding: '13px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #1b6ca8, #2196f3)',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '4px',
    boxShadow: '0 4px 12px rgba(33,150,243,0.35)',
  },
  buttonLoading: {
    padding: '13px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#93c5fd',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'not-allowed',
    marginTop: '4px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '32px',
    fontSize: '12px',
    color: '#94a3b8',
  },
};

export default Login;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', form);
      login(response.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f6f8',
  },
  form: {
    width: '350px',
    padding: '30px',
    borderRadius: '12px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#1976d2',
    color: '#fff',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    fontSize: '14px',
  },
};

export default Login;