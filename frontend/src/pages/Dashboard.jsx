import { useAuth } from '../context/useAuth';

const Dashboard = () => {
  const { auth, logout } = useAuth();

  return (
    <div style={{ padding: '30px' }}>
      <h1>Dashboard</h1>
      <p><strong>Usuario:</strong> {auth.user?.nombre} {auth.user?.apellido}</p>
      <p><strong>Rol:</strong> {auth.user?.rol}</p>
      <p><strong>Clínica:</strong> {auth.clinica?.nombre}</p>

      <button onClick={logout} style={{ marginTop: '20px', padding: '10px 16px' }}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default Dashboard;