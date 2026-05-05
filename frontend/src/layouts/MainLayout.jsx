import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const MainLayout = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2>Sistema Dental</h2>
        <p style={styles.clinicName}>{auth.clinic?.name}</p>

        <nav style={styles.nav}>
          <Link to="/dashboard" style={styles.link}>Dashboard</Link>
          <Link to="/patients" style={styles.link}>Pacientes</Link>
          <Link to="/appointments" style={styles.link}>Citas</Link>
        </nav>

        <button onClick={handleLogout} style={styles.button}>
          Cerrar sesión
        </button>
      </aside>

      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
  },
  sidebar: {
    width: '240px',
    backgroundColor: '#1e293b',
    color: '#fff',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  clinicName: {
    fontSize: '14px',
    marginBottom: '30px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
  },
  button: {
    marginTop: 'auto',
    padding: '10px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  main: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: '30px',
  },
};

export default MainLayout;