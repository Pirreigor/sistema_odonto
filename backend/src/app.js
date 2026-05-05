const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const authRoutes = require('./routes/auth.routes');
const testRoutes = require('./routes/test.routes');
const patientRoutes = require('./routes/patient.routes');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API del sistema odontológico funcionando');
});

app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/patients', patientRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});