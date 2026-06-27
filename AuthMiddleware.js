import jwt from 'jsonwebtoken';

// Middleware para verificar token y roles (Objetivo 1 / NFR-5)
export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: "No se proporcionó un token de acceso" });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET || 'secret_key_sgc');
        req.user = decoded; // Contiene id, email y rol
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
};

// Verifica si el usuario tiene el permiso necesario (SOLID: SRP)
export const authorizeRole = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!rolesPermitidos.includes(req.user.rol)) {
            return res.status(403).json({ 
                message: `Acceso denegado. Se requiere rol: ${rolesPermitidos.join(" o ")}` 
            });
        }
        next();
    };
};