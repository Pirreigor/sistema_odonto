const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const authRoutes = require('./routes/auth.routes');
const testRoutes = require('./routes/test.routes');
const patientRoutes = require('./routes/patient.routes');
const sedeRoutes = require('./routes/sede.routes');
const citaRoutes = require('./routes/cita.routes');
const servicioRoutes = require('./routes/servicio.routes');
const historiaRoutes = require('./routes/historia.routes');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API del sistema odontológico funcionando');
});

app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/pacientes', patientRoutes);
app.use('/api/sedes', sedeRoutes);
app.use('/api/citas', citaRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/historia', historiaRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});