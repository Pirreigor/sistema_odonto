import { useEffect, useState } from 'react';
import api from '../api/axios';

const Appointments = () => {
  const [citas, setCitas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    sede_id: '', paciente_id: '', doctor_id: '', servicio_id: '',
    fecha: '', hora_inicio: '', hora_fin: '', notas: '',
  };
  const [form, setForm] = useState(initialForm);

  const fetchAll = async () => {
    try {
      const [resCitas, resPacientes, resSedes, resServicios] = await Promise.all([
        api.get('/citas'),
        api.get('/pacientes'),
        api.get('/sedes'),
        api.get('/servicios'),
      ]);
      setCitas(resCitas.data);
      setPacientes(resPacientes.data);
      setSedes(resSedes.data);
      setServicios(resServicios.data);
      // Doctores: filtrar usuarios con rol dentista del listado de pacientes no aplica,
      // por ahora se carga al crear cita — se completará cuando haya endpoint de usuarios
      setDoctores([]);
    } catch {
      setError('No se pudo cargar la información');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleEdit = (cita) => {
    setForm({
      sede_id: cita.sede_id || '',
      paciente_id: cita.paciente_id || '',
      doctor_id: cita.doctor_id || '',
      servicio_id: cita.servicio_id || '',
      fecha: cita.fecha ? cita.fecha.split('T')[0] : '',
      hora_inicio: cita.hora_inicio || '',
      hora_fin: cita.hora_fin || '',
      notas: cita.notas || '',
    });
    setEditingId(cita.id);
  };

  const handleCancelEdit = () => { setForm(initialForm); setEditingId(null); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setSaving(true);
      if (editingId) {
        await api.put(`/citas/${editingId}`, form);
      } else {
        await api.post('/citas', form);
      }
      setForm(initialForm);
      setEditingId(null);
      await fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo guardar la cita');
    } finally {
      setSaving(false);
    }
  };

  const handleEstado = async (id, estado) => {
    try {
      await api.patch(`/citas/${id}/estado`, { estado });
      await fetchAll();
    } catch {
      setError('No se pudo actualizar el estado');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Deseas eliminar esta cita?')) return;
    try {
      await api.delete(`/citas/${id}`);
      await fetchAll();
    } catch {
      setError('No se pudo eliminar la cita');
    }
  };

  const estadoColor = {
    pendiente: '#f59e0b', confirmada: '#3b82f6', en_atencion: '#8b5cf6',
    completada: '#10b981', cancelada: '#ef4444', no_asistio: '#6b7280',
  };

  return (
    <div>
      <h1>Citas</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <select name="sede_id" value={form.sede_id} onChange={handleChange} style={styles.input} required>
          <option value="">Seleccionar sede</option>
          {sedes.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
        </select>

        <select name="paciente_id" value={form.paciente_id} onChange={handleChange} style={styles.input} required>
          <option value="">Seleccionar paciente</option>
          {pacientes.map(p => <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>)}
        </select>

        <select name="servicio_id" value={form.servicio_id} onChange={handleChange} style={styles.input}>
          <option value="">Seleccionar servicio (opcional)</option>
          {servicios.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
        </select>

        <input type="date" name="fecha" value={form.fecha} onChange={handleChange} style={styles.input} required />
        <input type="time" name="hora_inicio" value={form.hora_inicio} onChange={handleChange} style={styles.input} required />
        <input type="time" name="hora_fin" value={form.hora_fin} onChange={handleChange} style={styles.input} required />

        <textarea name="notas" placeholder="Notas (opcional)" value={form.notas} onChange={handleChange} style={styles.textarea} />

        <button type="submit" style={styles.button} disabled={saving}>
          {saving ? (editingId ? 'Actualizando...' : 'Guardando...') : (editingId ? 'Actualizar cita' : 'Registrar cita')}
        </button>
        {editingId && <button type="button" onClick={handleCancelEdit} style={styles.cancelButton}>Cancelar</button>}
      </form>

      {error && <p style={styles.error}>{error}</p>}
      {loading && <p>Cargando citas...</p>}
      {!loading && citas.length === 0 && <p>No hay citas registradas.</p>}

      {!loading && citas.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Fecha</th>
              <th style={styles.th}>Hora</th>
              <th style={styles.th}>Paciente</th>
              <th style={styles.th}>Doctor</th>
              <th style={styles.th}>Sede</th>
              <th style={styles.th}>Servicio</th>
              <th style={styles.th}>Estado</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.map(c => (
              <tr key={c.id}>
                <td style={styles.td}>{c.fecha?.split('T')[0]}</td>
                <td style={styles.td}>{c.hora_inicio} - {c.hora_fin}</td>
                <td style={styles.td}>{c.paciente_nombre} {c.paciente_apellido}</td>
                <td style={styles.td}>Dr. {c.doctor_nombre} {c.doctor_apellido}</td>
                <td style={styles.td}>{c.sede_nombre}</td>
                <td style={styles.td}>{c.servicio_nombre || '-'}</td>
                <td style={styles.td}>
                  <select
                    value={c.estado}
                    onChange={(e) => handleEstado(c.id, e.target.value)}
                    style={{ ...styles.badge, backgroundColor: estadoColor[c.estado] }}
                  >
                    {['pendiente','confirmada','en_atencion','completada','cancelada','no_asistio'].map(est => (
                      <option key={est} value={est}>{est.replace('_', ' ')}</option>
                    ))}
                  </select>
                </td>
                <td style={styles.td}>
                  <button onClick={() => handleEdit(c)} style={styles.editButton}>Editar</button>
                  <button onClick={() => handleDelete(c.id)} style={styles.deleteButton}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  form: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '20px' },
  input: { padding: '10px', border: '1px solid #ccc', borderRadius: '8px' },
  textarea: { gridColumn: '1 / -1', padding: '10px', border: '1px solid #ccc', borderRadius: '8px', minHeight: '80px' },
  button: { gridColumn: '1 / -1', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#2563eb', color: '#fff' },
  cancelButton: { gridColumn: '1 / -1', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#6b7280', color: '#fff' },
  error: { color: 'red' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden' },
  th: { padding: '12px', textAlign: 'left', backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0' },
  td: { padding: '12px', borderBottom: '1px solid #e2e8f0' },
  badge: { color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px' },
  editButton: { marginRight: '8px', padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#f59e0b', color: '#fff' },
  deleteButton: { padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#ef4444', color: '#fff' },
};

export default Appointments;