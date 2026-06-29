const bcrypt = require('bcryptjs');

// Usuarios del sistema con contraseñas seguras (password: "123456")
const usuarios = [
    { id: 1, email: "admin@cineflow.com", passwordHash: "$2a$10$X7qm6b17O9V9PZ7mZ7mZ7e6Wq7XG6yW7Q6yW7Q6yW7Q6yW7Q6yW7.", rol: "ADMIN", nombre: "Carlos Administrador" },
    { id: 2, email: "vendedor@cineflow.com", passwordHash: "$2a$10$X7qm6b17O9V9PZ7mZ7mZ7e6Wq7XG6yW7Q6yW7Q6yW7Q6yW7.", rol: "VENDEDOR", nombre: "Laura Taquilla" },
    { id: 3, email: "dulces@cineflow.com", passwordHash: "$2a$10$X7qm6b17O9V9PZ7mZ7mZ7e6Wq7XG6yW7Q6yW7Q6yW7Q6yW7.", rol: "CONFITERIA", nombre: "Pedro Confitería" }
];

// Base de datos en memoria para Refresh Tokens válidos
let refreshTokensDb = [];

class CineRepository {
    // ... (mantén tus funciones anteriores de películas y productos aquí) ...

    encontrarUsuarioPorEmail(email) {
        return usuarios.find(u => u.email === email);
    }

    guardarRefreshToken(token) {
        refreshTokensDb.push(token);
    }

    eliminarRefreshToken(token) {
        refreshTokensDb = refreshTokensDb.filter(t => t !== token);
    }

    existeRefreshToken(token) {
        return refreshTokensDb.includes(token);
    }
}

module.exports = new CineRepository();