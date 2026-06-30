const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Añadido para mejorar la seguridad global
const cineController = require('./controllers/cineController');

const app = express();

// 1. Solución para ocultar la información del framework
app.disable('x-powered-by'); // Desactiva explícitamente la cabecera por defecto
app.use(helmet());           // Aplica buenas prácticas de seguridad en cabeceras HTTP

const PORT = process.env.PORT || 3000;

// 2. Solución para mitigar el aviso de CORS inseguro
// Define los orígenes permitidos (por ejemplo, tu frontend local)
const opcionesCors = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // O la URL de tu app React/LiveServer
    optionsSuccessStatus: 200
};
app.use(cors(opcionesCors)); 

app.use(express.json());

// Registro de rutas bajo el prefijo /api
app.use('/api', cineController);

// Inicio de Servidor
app.listen(PORT, () => {
    console.log(`Servidor de CineFlow corriendo en http://localhost:${PORT}`);
});

module.exports = app;