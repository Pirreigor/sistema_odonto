import { useEffect, useState } from 'react';
import api from '../api/axios';

const initialForm = {
  dni: '',
  name: '',
  lastname: '',
  birth_date: '',
  gender: '',
  phone: '',
  email: '',
  address: '',
  medical_notes: '',
};

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  const fetchPatients = async () => {
    try {
      const response = await api.get('/patients');
      setPatients(response.data);
    } catch (err) {
      setError('No se pudieron cargar los pacientes');
      console.error('Error al cargar pacientes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (patient) => {
    setForm({
      dni: patient.dni || '',
      name: patient.name || '',
      lastname: patient.lastname || '',
      birth_date: patient.birth_date ? patient.birth_date.split('T')[0] : '',
      gender: patient.gender || '',
      phone: patient.phone || '',
      email: patient.email || '',
      address: patient.address || '',
      medical_notes: patient.medical_notes || '',
    });

    setEditingId(patient.id);
    setError('');
  };

  const handleCancelEdit = () => {
    setForm(initialForm);
    setEditingId(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('El nombre del paciente es obligatorio');
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await api.put(`/patients/${editingId}`, form);
      } else {
        await api.post('/patients', form);
      }

      setForm(initialForm);
      setEditingId(null);
      await fetchPatients();
    } catch (err) {
      setError(
        editingId
          ? 'No se pudo actualizar el paciente'
          : 'No se pudo registrar el paciente'
      );
      console.error('Error al guardar paciente:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Deseas eliminar este paciente?');

    if (!confirmDelete) return;

    try {
      await api.delete(`/patients/${id}`);

      if (editingId === id) {
        setForm(initialForm);
        setEditingId(null);
      }

      await fetchPatients();
    } catch (err) {
      setError('No se pudo eliminar el paciente');
      console.error('Error al eliminar paciente:', err);
    }
  };

  return (
    <div>
      <h1>Pacientes</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="dni"
          placeholder="DNI"
          value={form.dni}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="text"
          name="name"
          placeholder="Nombres"
          value={form.name}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="text"
          name="lastname"
          placeholder="Apellidos"
          value={form.lastname}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="date"
          name="birth_date"
          value={form.birth_date}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="text"
          name="gender"
          placeholder="Género"
          value={form.gender}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="text"
          name="phone"
          placeholder="Teléfono"
          value={form.phone}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="text"
          name="address"
          placeholder="Dirección"
          value={form.address}
          onChange={handleChange}
          style={styles.input}
        />

        <textarea
          name="medical_notes"
          placeholder="Observaciones médicas"
          value={form.medical_notes}
          onChange={handleChange}
          style={styles.textarea}
        />

        <button type="submit" style={styles.button} disabled={saving}>
          {saving
            ? editingId
              ? 'Actualizando...'
              : 'Guardando...'
            : editingId
            ? 'Actualizar paciente'
            : 'Registrar paciente'}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={handleCancelEdit}
            style={styles.cancelButton}
          >
            Cancelar edición
          </button>
        )}
      </form>

      {error && <p style={styles.error}>{error}</p>}

      {loading && <p>Cargando pacientes...</p>}

      {!loading && patients.length === 0 && (
        <p>No hay pacientes registrados.</p>
      )}

      {!loading && patients.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>N°</th>
              <th style={styles.th}>DNI</th>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Apellido</th>
              <th style={styles.th}>Teléfono</th>
              <th style={styles.th}>Correo</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, index) => (
              <tr key={patient.id}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{patient.dni}</td>
                <td style={styles.td}>{patient.name}</td>
                <td style={styles.td}>{patient.lastname}</td>
                <td style={styles.td}>{patient.phone}</td>
                <td style={styles.td}>{patient.email}</td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    <button
                      onClick={() => handleEdit(patient)}
                      style={styles.editButton}
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => handleDelete(patient.id)}
                      style={styles.deleteButton}
                    >
                      Eliminar
                    </button>
                  </div>
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
  form: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
  textarea: {
    gridColumn: '1 / -1',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    minHeight: '90px',
  },
  button: {
    gridColumn: '1 / -1',
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: '#2563eb',
    color: '#fff',
  },
  cancelButton: {
    gridColumn: '1 / -1',
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: '#64748b',
    color: '#fff',
  },
  error: {
    color: 'red',
    marginBottom: '12px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
  },
  th: {
    border: '1px solid #ddd',
    padding: '10px',
    backgroundColor: '#f1f5f9',
    textAlign: 'left',
  },
  td: {
    border: '1px solid #ddd',
    padding: '10px',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  editButton: {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: '#0f766e',
    color: '#fff',
  },
  deleteButton: {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: '#dc2626',
    color: '#fff',
  },
};

export default Patients;