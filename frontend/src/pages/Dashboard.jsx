import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import api from '../api/axios';

const Dashboard = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ pacientes: 0, citasHoy: 0, sedes: 0, servicios: 0 });
  const [citasHoy, setCitasHoy] = useState([]);

  useEffect(() => {
    const hoy = new Date().toISOString().split('T')[0];
    Promise.all([
      api.get('/pacientes').catch(() => ({ data: [] })),
      api.get(`/citas?fecha=${hoy}`).catch(() => ({ data: [] })),
      api.get('/sedes').catch(() => ({ data: [] })),
      api.get('/servicios').catch(() => ({ data: [] })),
    ]).then(([p, c, s, sv]) => {
      setStats({ pacientes: p.data.length, citasHoy: c.data.length, sedes: s.data.length, servicios: sv.data.length });
      setCitasHoy(c.data.slice(0, 5));
    });
  }, []);

  const hora = new Date().getHours();
  const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches';

  const rolLabel = {
    super_admin: 'Super Administrador',
    admin_clinica: 'Administrador de Clínica',
    dentista: 'Dentista',
    recepcionista: 'Recepcionista',
    asistente: 'Asistente',
  };

  const estadoColor = {
    pendiente: '#f59e0b', confirmada: '#3b82f6', en_atencion: '#8b5cf6',
    completada: '#10b981', cancelada: '#ef4444', no_asistio: '#6b7280',
  };

  const cards = [
    { label: 'Pacientes', value: stats.pacientes, icon: '👥', color: '#3b82f6', bg: '#eff6ff', route: '/patients' },
    { label: 'Citas hoy', value: stats.citasHoy, icon: '📅', color: '#8b5cf6', bg: '#f5f3ff', route: '/appointments' },
    { label: 'Sedes', value: stats.sedes, icon: '🏥', color: '#10b981', bg: '#f0fdf4', route: '/sedes' },
    { label: 'Servicios', value: stats.servicios, icon: '🦷', color: '#f59e0b', bg: '#fffbeb', route: null },
  ];

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{saludo}, {auth.user?.nombre} 👋</h1>
          <p style={styles.subtitle}>
            <span style={styles.rolBadge}>{rolLabel[auth.user?.rol] || auth.user?.rol}</span>
            {' · '}{auth.clinica?.nombre}
          </p>
        </div>
        <div style={styles.dateBox}>
          {new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      {/* Tarjetas */}
      <div style={styles.cards}>
        {cards.map(c => (
          <div
            key={c.label}
            style={{ ...styles.card, cursor: c.route ? 'pointer' : 'default' }}
            onClick={() => c.route && navigate(c.route)}
          >
            <div style={{ ...styles.cardIcon, backgroundColor: c.bg, color: c.color }}>
              {c.icon}
            </div>
            <div>
              <div style={{ ...styles.cardValue, color: c.color }}>{c.value}</div>
              <div style={styles.cardLabel}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Citas de hoy */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>📋 Citas de hoy</h2>
          <button style={styles.verTodas} onClick={() => navigate('/appointments')}>Ver todas →</button>
        </div>

        {citasHoy.length === 0 ? (
          <div style={styles.empty}>No hay citas programadas para hoy</div>
        ) : (
          <div style={styles.citasList}>
            {citasHoy.map(c => (
              <div key={c.id} style={styles.citaItem}>
                <div style={styles.citaHora}>{c.hora_inicio?.slice(0,5)}</div>
                <div style={styles.citaInfo}>
                  <span style={styles.citaPaciente}>{c.paciente_nombre} {c.paciente_apellido}</span>
                  <span style={styles.citaDoctor}>Dr. {c.doctor_nombre} {c.doctor_apellido}</span>
                </div>
                <div style={styles.citaSede}>{c.sede_nombre}</div>
                <span style={{ ...styles.estadoBadge, backgroundColor: estadoColor[c.estado] + '20', color: estadoColor[c.estado] }}>
                  {c.estado.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '32px', fontFamily: "'Segoe UI', system-ui, sans-serif" },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' },
  title: { fontSize: '26px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0' },
  subtitle: { fontSize: '14px', color: '#64748b', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' },
  rolBadge: { backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  dateBox: { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 16px', fontSize: '14px', color: '#475569', textTransform: 'capitalize' },
  cards: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' },
  card: { backgroundColor: '#fff', borderRadius: '14px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', transition: 'transform 0.1s' },
  cardIcon: { width: '52px', height: '52px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 },
  cardValue: { fontSize: '28px', fontWeight: '700', lineHeight: 1 },
  cardLabel: { fontSize: '13px', color: '#64748b', marginTop: '4px' },
  section: { backgroundColor: '#fff', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  sectionTitle: { fontSize: '16px', fontWeight: '600', color: '#0f172a', margin: 0 },
  verTodas: { background: 'none', border: 'none', color: '#2563eb', fontSize: '13px', cursor: 'pointer', fontWeight: '500' },
  empty: { textAlign: 'center', color: '#94a3b8', padding: '32px 0', fontSize: '14px' },
  citasList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  citaItem: { display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '10px' },
  citaHora: { fontSize: '16px', fontWeight: '700', color: '#1d4ed8', minWidth: '48px' },
  citaInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' },
  citaPaciente: { fontSize: '14px', fontWeight: '600', color: '#0f172a' },
  citaDoctor: { fontSize: '12px', color: '#64748b' },
  citaSede: { fontSize: '12px', color: '#94a3b8' },
  estadoBadge: { padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', textTransform: 'capitalize', whiteSpace: 'nowrap' },
};

export default Dashboard;
