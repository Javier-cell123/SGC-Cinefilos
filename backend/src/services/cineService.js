const cineRepository = require('../repositories/cineRepository');

class CineService {
    listarCartelera() {
        return cineRepository.obtenerPeliculas();
    }

    agregarPelicula(datosPeli) {
        if (!datosPeli.titulo || !datosPeli.genero) {
            throw new Error("Datos de película inválidos o incompletos.");
        }
        return cineRepository.crearPelicula(datosPeli);
    }

    listarProductos() {
        return cineRepository.obtenerProductos();
    }

    venderProductoConfiteria(id) {
        const productos = cineRepository.obtenerProductos();
        const producto = productos.find(p => p.id === id);

        if (!producto) {
            throw new Error("Producto no encontrado.");
        }
        if (producto.stock <= 0) {
            throw new Error("BR-12: STOCK AGOTADO"); // Mantiene tu regla de negocio original
        }

        const nuevoStock = producto.stock - 1;
        return cineRepository.actualizarStockProducto(id, nuevoStock);
    }
}

module.exports = new CineService();