// Implementación del Patrón Factory para generar comprobantes (Objetivo 6)
class Ticket {
    constructor(data) {
        this.data = data;
        this.fecha = new Date().toLocaleString();
    }
    render() { throw new Error("Método render() debe ser implementado"); }
}

class MovieTicket extends Ticket {
    render() {
        return `
        ===============================
        TICKET DE CINE - SGC
        ===============================
        Fecha: ${this.fecha}
        Película: ${this.data.pelicula}
        Sala: ${this.data.sala}
        Asiento: ${this.data.asiento}
        Monto Pagado: $${this.data.monto}
        Vendedor: ${this.data.vendedor}
        ===============================`;
    }
}

class SnackTicket extends Ticket {
    render() {
        return `
        ===============================
        COMPROBANTE CONFITERÍA
        ===============================
        Fecha: ${this.fecha}
        Productos: ${this.data.productos.join(", ")}
        Total: $${this.data.monto}
        ===============================`;
    }
}

export class TicketFactory {
    static createTicket(type, data) {
        if (type === 'MOVIE') return new MovieTicket(data);
        if (type === 'SNACK') return new SnackTicket(data);
        throw new Error("Tipo de ticket no soportado");
    }
}