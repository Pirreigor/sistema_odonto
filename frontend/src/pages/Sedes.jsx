import { useEffect, useState } from 'react';
import api from '../api/axios';

const initialForm = { nombre: '', direccion: '', telefono: '', email: '' };

const Sedes = () => {
  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  const fetchSedes = async () => {
    try {
      const res = await api.get('/sedes');
      setSedes(res.data);
    } catch {
      setError('No se pudieron cargar las sedes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSedes(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleEdit = (sede) => {
    setForm({ nombre: sede.nombre, direccion: sede.direccion || '', telefono: sede.telefono || '', email: sede.email || '' });
    setEditingId(sede.id);
    setError('');
  };

  const handleCancelEdit = () => { setForm(initialForm); setEditingId(null); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setSaving(true);
      if (editingId) {
        await api.put(`/sedes/${editingId}`, form);
      } else {
        await api.post('/sedes', form);
      }
      setForm(initialForm);
      setEditingId(null);
      await fetchSedes();
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo guardar la sede');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Deseas eliminar esta sede?')) return;
    try {
      await api.delete(`/sedes/${id}`);
      await fetchSedes();
    } catch {
      setError('No se pudo eliminar la sede');
    }
  };

  return (
    <div>
      <h1>Sedes</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" name="nombre" placeholder="Nombre de la sede" value={form.nombre} onChange={handleChange} style={styles.input} required />
        <input type="text" name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} style={styles.input} />
        <input type="text" name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} style={styles.input} />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} style={styles.input} />

        <button type="submit" style={styles.button} disabled={saving}>
          {saving ? (editingId ? 'Actualizando...' : 'Guardando...') : (editingId ? 'Actualizar sede' : 'Registrar sede')}
        </button>
        {editingId && <button type="button" onClick={handleCancelEdit} style={styles.cancelButton}>Cancelar</button>}
      </form>

      {error && <p style={styles.error}>{error}</p>}
      {loading && <p>Cargando sedes...</p>}
      {!loading && sedes.length === 0 && <p>No hay sedes registradas.</p>}

      {!loading && sedes.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Dirección</th>
              <th style={styles.th}>Teléfono</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sedes.map(s => (
              <tr key={s.id}>
                <td style={styles.td}>{s.nombre}</td>
                <td style={styles.td}>{s.direccion || '-'}</td>
                <td style={styles.td}>{s.telefono || '-'}</td>
                <td style={styles.td}>{s.email || '-'}</td>
                <td style={styles.td}>
                  <button onClick={() => handleEdit(s)} style={styles.editButton}>Editar</button>
                  <button onClick={() => handleDelete(s.id)} style={styles.deleteButton}>Eliminar</button>
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
  button: { gridColumn: '1 / -1', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#2563eb', color: '#fff' },
  cancelButton: { gridColumn: '1 / -1', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#6b7280', color: '#fff' },
  error: { color: 'red' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden' },
  th: { padding: '12px', textAlign: 'left', backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0' },
  td: { padding: '12px', borderBottom: '1px solid #e2e8f0' },
  editButton: { marginRight: '8px', padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#f59e0b', color: '#fff' },
  deleteButton: { padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#ef4444', color: '#fff' },
};

export default Sedes;
