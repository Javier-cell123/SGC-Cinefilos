const express = require('express');
const cors = require('cors');
const cineController = require('./controllers/cineController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Registro de rutas bajo el prefijo /api
app.use('/api', cineController);

// Inicio de Servidor
app.listen(PORT, () => {
    console.log(`Servidor de CineFlow corriendo en http://localhost:${PORT}`);
});

module.exports = app;