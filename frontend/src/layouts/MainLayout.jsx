import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '⊞' },
  { to: '/patients', label: 'Pacientes', icon: '👥' },
  { to: '/appointments', label: 'Citas', icon: '📅' },
  { to: '/sedes', label: 'Sedes', icon: '🏥' },
];

const MainLayout = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        {/* Logo */}
        <div style={styles.brand}>
          <div style={styles.brandIcon}>🦷</div>
          <div>
            <div style={styles.brandName}>OdontoSystem</div>
            <div style={styles.brandClinic}>{auth.clinica?.nombre}</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={styles.nav}>
          {navItems.map(item => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                style={{ ...styles.link, ...(active ? styles.linkActive : {}) }}
              >
                <span style={styles.linkIcon}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Usuario */}
        <div style={styles.userBox}>
          <div style={styles.userAvatar}>
            {auth.user?.nombre?.[0]}{auth.user?.apellido?.[0]}
          </div>
          <div style={styles.userInfo}>
            <div style={styles.userName}>{auth.user?.nombre} {auth.user?.apellido}</div>
            <div style={styles.userRole}>{auth.user?.rol?.replace('_', ' ')}</div>
          </div>
          <button onClick={handleLogout} title="Cerrar sesión" style={styles.logoutBtn}>⏻</button>
        </div>
      </aside>

      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

const styles = {
  container: { display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" },
  sidebar: { width: '248px', backgroundColor: '#0f172a', color: '#fff', padding: '0', display: 'flex', flexDirection: 'column', flexShrink: 0 },
  brand: { display: 'flex', alignItems: 'center', gap: '12px', padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  brandIcon: { width: '40px', height: '40px', backgroundColor: '#1d4ed8', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 },
  brandName: { fontSize: '15px', fontWeight: '700', color: '#f1f5f9' },
  brandClinic: { fontSize: '11px', color: '#64748b', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '2px', padding: '16px 12px', flex: 1 },
  link: { display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8', textDecoration: 'none', padding: '10px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', transition: 'all 0.15s' },
  linkActive: { backgroundColor: '#1e3a5f', color: '#60a5fa' },
  linkIcon: { fontSize: '16px', width: '20px', textAlign: 'center' },
  userBox: { display: 'flex', alignItems: 'center', gap: '10px', padding: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '0' },
  userAvatar: { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 },
  userInfo: { flex: 1, overflow: 'hidden' },
  userName: { fontSize: '13px', fontWeight: '600', color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  userRole: { fontSize: '11px', color: '#64748b', textTransform: 'capitalize' },
  logoutBtn: { background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '18px', padding: '4px', flexShrink: 0 },
  main: { flex: 1, backgroundColor: '#f1f5f9', overflow: 'auto' },
};

export default MainLayout;
