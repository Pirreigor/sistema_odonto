import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/useAuth';

/* ── CSS global inyectado una sola vez ── */
const injectCSS = () => {
  if (document.getElementById('login-styles')) return;
  const el = document.createElement('style');
  el.id = 'login-styles';
  el.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    .login-page *, .login-page *::before, .login-page *::after { box-sizing: border-box; }
    .login-page { font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; }

    @keyframes float {
      0%,100% { transform: translateY(0); }
      50%      { transform: translateY(-14px); }
    }
    @keyframes fadeUp {
      from { opacity:0; transform:translateY(20px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .login-illustration { animation: float 5.5s ease-in-out infinite; }
    .login-card         { animation: fadeUp 0.5s cubic-bezier(.16,1,.3,1) both; }
    .login-spinner      { animation: spin 0.8s linear infinite; display:inline-block; }

    .login-input {
      width: 100%;
      padding: 13px 44px 13px 46px;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      font-size: 14px;
      font-family: inherit;
      background: #ffffff;
      color: #0f172a;
      outline: none;
      transition: border-color .2s, box-shadow .2s;
    }
    .login-input::placeholder { color: #94a3b8; }
    .login-input:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 3.5px rgba(37,99,235,.13);
    }

    .login-btn {
      width: 100%;
      padding: 14px;
      border: none;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 700;
      font-family: inherit;
      color: #fff;
      background: linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%);
      background-size: 200% auto;
      cursor: pointer;
      transition: background-position .4s, transform .15s, box-shadow .2s;
      box-shadow: 0 4px 14px rgba(37,99,235,.35);
      letter-spacing: .3px;
    }
    .login-btn:hover:not(:disabled) {
      background-position: right center;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(37,99,235,.45);
    }
    .login-btn:active:not(:disabled) { transform: translateY(0); }
    .login-btn:disabled { opacity:.65; cursor:not-allowed; }

    .login-eye {
      position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
      background: none; border: none; cursor: pointer;
      color: #94a3b8; padding: 4px; line-height: 1;
      transition: color .2s;
    }
    .login-eye:hover { color: #475569; }

    .login-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: rgba(255,255,255,.35);
      display: inline-block;
    }
    .login-dot.active { background: #fff; }
  `;
  document.head.appendChild(el);
};

const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const IconLock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconEye = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconEyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const IconAlert = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const DentalIllustration = () => (
  <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M110 28C88 28 70 46 70 68c0 14 5 26 13.5 35L90 160h40l6.5-57C144.5 94 150 82 150 68c0-22-18-40-40-40z"
      fill="white" fillOpacity="0.18" stroke="white" strokeOpacity="0.5" strokeWidth="2"/>
    <ellipse cx="95" cy="58" rx="8" ry="14" fill="white" fillOpacity="0.12" transform="rotate(-20 95 58)"/>
    <path d="M60 80C46 80 36 90 36 104c0 8 3 15 8 20l3.5 30H72l3.5-30c5-5 8-12 8-20 0-14-10-24-23.5-24z"
      fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.35" strokeWidth="1.5"/>
    <path d="M160 80c-13.5 0-23.5 10-23.5 24 0 8 3 15 8 20l3.5 30h24.5l3.5-30c5-5 8-12 8-20 0-14-10-24-24-24z"
      fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.35" strokeWidth="1.5"/>
    <circle cx="42" cy="42" r="10" fill="white" fillOpacity="0.08"/>
    <circle cx="178" cy="38" r="7" fill="white" fillOpacity="0.1"/>
    <circle cx="185" cy="155" r="12" fill="white" fillOpacity="0.07"/>
    <circle cx="30" cy="160" r="8" fill="white" fillOpacity="0.09"/>
    <rect x="166" y="60" width="4" height="16" rx="2" fill="white" fillOpacity="0.4"/>
    <rect x="160" y="66" width="16" height="4" rx="2" fill="white" fillOpacity="0.4"/>
    <circle cx="50" cy="110" r="2.5" fill="white" fillOpacity="0.5"/>
    <circle cx="170" cy="108" r="2" fill="white" fillOpacity="0.4"/>
    <circle cx="110" cy="185" r="2" fill="white" fillOpacity="0.35"/>
  </svg>
);

const Login = () => {
  injectCSS();
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
      setError(err.response?.data?.message || 'Correo o contrasena incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" style={s.page}>
      <div style={s.left}>
        <div style={s.dotsPattern} aria-hidden="true" />
        <div style={s.leftContent}>
          <div className="login-illustration" style={s.illustrationWrap}>
            <DentalIllustration />
          </div>
          <div style={s.leftText}>
            <h1 style={s.brandTitle}>OdontoSystem</h1>
            <p style={s.brandTagline}>
              La plataforma mas completa para<br/>la gestion de clinicas dentales
            </p>
          </div>
          <div style={s.pills}>
            {['Multi-clinica', 'Multi-sede', 'Historia clinica', 'Citas en linea'].map(f => (
              <span key={f} style={s.pill}>{f}</span>
            ))}
          </div>
          <div style={s.dots}>
            <span className="login-dot active" />
            <span className="login-dot" />
            <span className="login-dot" />
          </div>
        </div>
      </div>

      <div style={s.right}>
        <div className="login-card" style={s.card}>
          <div style={s.cardTop}>
            <div style={s.miniLogo}>🦷</div>
            <h2 style={s.cardTitle}>Bienvenido de nuevo</h2>
            <p style={s.cardSub}>Ingresa tus credenciales para acceder al sistema</p>
          </div>

          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.field}>
              <label style={s.label}>Correo electronico</label>
              <div style={s.inputWrap}>
                <span style={s.iconLeft}><IconMail /></span>
                <input
                  className="login-input"
                  type="email"
                  name="email"
                  placeholder="usuario@clinica.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div style={s.field}>
              <label style={s.label}>Contrasena</label>
              <div style={{ ...s.inputWrap, position: 'relative' }}>
                <span style={s.iconLeft}><IconLock /></span>
                <input
                  className="login-input"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="**********"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: '48px' }}
                />
                <button
                  type="button"
                  className="login-eye"
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
            </div>

            {error && (
              <div style={s.errorBox} role="alert">
                <IconAlert />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="login-btn" disabled={loading} style={{ marginTop: '4px' }}>
              {loading ? 'Verificando...' : 'Iniciar sesion ->'}
            </button>
          </form>

          <p style={s.footer}>2026 OdontoSystem - Todos los derechos reservados</p>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { display: 'flex', minHeight: '100vh', overflow: 'hidden' },
  left: {
    flex: '0 0 52%',
    background: 'linear-gradient(145deg, #0d1b4b 0%, #1a3a8f 40%, #1d6fa4 75%, #1e9fc4 100%)',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  dotsPattern: {
    position: 'absolute', inset: 0,
    backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1.5px, transparent 1.5px)',
    backgroundSize: '28px 28px',
    pointerEvents: 'none',
  },
  leftContent: {
    position: 'relative', zIndex: 1,
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: '28px', padding: '48px 32px', maxWidth: '420px',
  },
  illustrationWrap: { filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.25))' },
  leftText: { textAlign: 'center', color: '#fff' },
  brandTitle: { fontSize: '36px', fontWeight: '800', margin: '0 0 10px 0', letterSpacing: '-0.8px', lineHeight: 1.1 },
  brandTagline: { fontSize: '15px', opacity: 0.78, margin: 0, lineHeight: 1.6 },
  pills: { display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.22)',
    color: '#fff', borderRadius: '20px', padding: '5px 14px',
    fontSize: '12px', fontWeight: '500', backdropFilter: 'blur(4px)',
  },
  dots: { display: 'flex', gap: '8px', alignItems: 'center' },
  right: {
    flex: 1, backgroundColor: '#f1f5f9',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '40px 32px',
  },
  card: {
    backgroundColor: '#ffffff', borderRadius: '20px', padding: '44px 40px',
    width: '100%', maxWidth: '420px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.08)',
    border: '1px solid #e8edf5',
  },
  cardTop: { marginBottom: '32px' },
  miniLogo: { fontSize: '32px', marginBottom: '16px', display: 'block' },
  cardTitle: { fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0', letterSpacing: '-0.4px' },
  cardSub: { fontSize: '14px', color: '#64748b', margin: 0, lineHeight: 1.5 },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '7px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#374151', letterSpacing: '0.1px' },
  inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  iconLeft: {
    position: 'absolute', left: '14px', color: '#94a3b8',
    display: 'flex', alignItems: 'center', pointerEvents: 'none',
  },
  errorBox: {
    display: 'flex', alignItems: 'center', gap: '8px',
    backgroundColor: '#fef2f2', border: '1px solid #fecaca',
    borderRadius: '10px', padding: '11px 14px',
    color: '#dc2626', fontSize: '13px', fontWeight: '500',
  },
  footer: { textAlign: 'center', marginTop: '28px', fontSize: '11px', color: '#94a3b8', letterSpacing: '0.2px' },
};

export default Login;
