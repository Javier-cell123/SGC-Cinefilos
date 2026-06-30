const express = require('express');
const router = express.Router();
const cineService = require('../services/cineService');
const authService = require('../services/authService');
const { verificarToken, permitirRoles } = require('../middlewares/authMiddleware');

// --- RUTAS PÚBLICAS DE AUTENTICACIÓN ---
router.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const resultado = await authService.iniciarSesion(email, password);
        res.json(resultado);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

router.post('/auth/refresh', (req, res) => {
    try {
        const { refreshToken } = req.body;
        const resultado = authService.renovarToken(refreshToken);
        res.json(resultado);
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
});

router.post('/auth/logout', (req, res) => {
    try {
        const { refreshToken } = req.body;
        const resultado = authService.cerrarSesion(refreshToken);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// --- RUTAS PROTEGIDAS Y AUTORIZADAS POR ROL ---

// Ver cartelera: Permitido para ADMIN y VENDEDOR
router.get('/peliculas', verificarToken, permitirRoles('ADMIN', 'VENDEDOR'), (req, res) => {
    const peliculas = cineService.listarCartelera();
    res.json(peliculas);
});

// Agregar película: Exclusivo de ADMIN
router.post('/peliculas', verificarToken, permitirRoles('ADMIN'), (req, res) => {
    try {
        const nuevaPeli = cineService.agregarPelicula(req.body);
        res.status(201).json(nuevaPeli);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Ver dulces: ADMIN y CONFITERIA
router.get('/productos', verificarToken, permitirRoles('ADMIN', 'CONFITERIA'), (req, res) => {
    const productos = cineService.listarProductos();
    res.json(productos);
});

// Vender dulce: ADMIN y CONFITERIA
router.post('/productos/:id/vender', verificarToken, permitirRoles('ADMIN', 'CONFITERIA'), (req, res) => {
    try {
        const idProd = Number.parseInt(req.params.id, 10);
        const productoActualizado = cineService.venderProductoConfiteria(idProd);
        res.json(productoActualizado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;