import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Patients from '../pages/Patients';
import Appointments from '../pages/Appointments';
import Sedes from '../pages/Sedes';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/useAuth';

const PrivateRoute = ({ children }) => {
  const { auth } = useAuth();
  return auth.token ? children : <Navigate to="/" />;
};

const AppRouter = () => {
  const { auth } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={auth.token ? <Navigate to="/dashboard" /> : <Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="sedes" element={<Sedes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;