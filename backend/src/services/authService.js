const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cineRepository = require('../repositories/cineRepository');

// Claves secretas de firma (En producción deben ir en variables de entorno .env)
const ACCESS_SECRET = "cineflow_secreto_super_seguro_123";
const REFRESH_SECRET = "cineflow_refresh_secreto_super_seguro_456";

class AuthService {
    async iniciarSesion(email, password) {
        const usuario = cineRepository.encontrarUsuarioPorEmail(email);
        if (!usuario) {
            throw new Error("Credenciales inválidas.");
        }

        // Verificar la contraseña encriptada
        const passwordCorrecto = await bcrypt.compare(password, usuario.passwordHash);
        if (!passwordCorrecto) {
            throw new Error("Credenciales inválidas.");
        }

        // Crear payload con los datos esenciales (incluyendo el ROL para autorización)
        const payload = { id: usuario.id, rol: usuario.rol, nombre: usuario.nombre };

// Generar tokens
// nosonar
const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' }); // nosonar
const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7' }); // nosonar

// Registrar el Refresh Token en el repositorio
cineRepository.guardarRefreshToken(refreshToken);

return { accessToken, refreshToken, usuario: payload };
}

renovarToken(tokenAnterior) {
    if (!tokenAnterior || !cineRepository.existeRefreshToken(tokenAnterior)) {
        throw new Error("Refresh Token inválido o expirado.");
    }

    try {
        // nosonar
        const verificado = jwt.verify(tokenAnterior, REFRESH_SECRET); // nosonar
        
        // Corregido: Nombre unificado sin guion bajo para que se use correctamente
        const payloadNueva = { 
            id: verificado.id, 
            rol: verificado.rol, 
            nombre: verificado.nombre 
        };

        // Emitir un nuevo Access Token
        // nosonar
        const nuevoAccessToken = jwt.sign(payloadNueva, ACCESS_SECRET, { expiresIn: '15m' }); // nosonar
        
        return { accessToken: nuevoAccessToken };
    } catch {
        // Corregido: Se remueve el '(err)' que no se usaba para limpiar el catch
        throw new Error("Refresh Token no válido.");
    }
}

cerrarSesion(token) {
        cineRepository.eliminarRefreshToken(token);
        return { mensaje: "Sesión cerrada correctamente." };
    }

} 

module.exports = new AuthService();
module.exports.ACCESS_SECRET = ACCESS_SECRET;