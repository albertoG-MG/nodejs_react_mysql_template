const express = require('express');
const app = express();
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');

const PORT = process.env.PORT || 3000;

//Middleware para parsear json
app.use(express.json());

// Usa las rutas definidas
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`El servidor está corriendo en: http://localhost:${PORT}`);
});