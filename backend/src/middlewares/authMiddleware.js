const jwt = require('jsonwebtoken');
const { ACCESS_SECRET } = require('../services/authService');

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Corregido con Optional Chaining (?.)
    const token = authHeader?.split(' ')[1]; // Formato: "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ error: "Acceso denegado. Token no proveído." });
    }

    try {
        const verificado = jwt.verify(token, ACCESS_SECRET);
        req.usuario = verificado; // Inyecta los datos decodificados en la petición
        next();
    } catch {
        // Corregido: se quitó el (error) inutilizado para cumplir con el linter
        return res.status(403).json({ error: "Token inválido o expirado." });
    }
};
// Middleware 2: Verificar si el rol del usuario tiene permiso para ejecutar la acción
const permitirRoles = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario || !rolesPermitidos.includes(req.usuario.role || req.usuario.rol)) {
            return res.status(403).json({ error: "No tienes permisos (Rol insuficiente) para esta acción." });
        }
        next();
    };
};

module.exports = { verificarToken, permitirRoles };