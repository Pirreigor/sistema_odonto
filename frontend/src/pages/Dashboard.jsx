import { useAuth } from '../context/useAuth';

const Dashboard = () => {
  const { auth, logout } = useAuth();

  return (
    <div style={{ padding: '30px' }}>
      <h1>Dashboard</h1>
      <p><strong>Usuario:</strong> {auth.user?.name} {auth.user?.lastname}</p>
      <p><strong>Rol:</strong> {auth.user?.role}</p>
      <p><strong>Clínica:</strong> {auth.clinic?.name}</p>

      <button onClick={logout} style={{ marginTop: '20px', padding: '10px 16px' }}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default Dashboard;