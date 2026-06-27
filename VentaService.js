import { PrismaClient } from '@prisma/client';
import { TicketFactory } from '../factories/TicketFactory.js';
import { PriceContext } from '../logic/PriceStrategies.js';

const prisma = new PrismaClient();

export class VentaService {
    async procesarVentaCine(asientoId, strategy, pagoEfectivo, vendedorNombre) {
        return await prisma.$transaction(async (tx) => {
            // 1. Validar Asiento y Bloqueo de 5 min (BR-3)
            const asiento = await tx.asiento.findUnique({
                where: { id: asientoId },
                include: { funcion: true }
            });

            const ahora = new Date();
            const tiempoBloqueo = 5 * 60 * 1000;
            const bloqueado = asiento.estado === 'bloqueado' && (ahora - asiento.bloqueadoEn < tiempoBloqueo);

            if (asiento.estado === 'vendido' || bloqueado) {
                throw new Error("El asiento ya no está disponible.");
            }

            // 2. Calcular Precio usando Patrón Strategy (SOLID: OCP)
            const total = strategy.calculate(asiento.funcion.precioBase);
            const vuelto = pagoEfectivo - total;

            if (vuelto < 0) throw new Error("Efectivo insuficiente.");

            // 3. Registrar Venta y Liberar/Vender Asiento
            await tx.asiento.update({
                where: { id: asientoId },
                data: { estado: 'vendido', bloqueadoEn: null }
            });

            // 4. Generar Comprobante con Factory (Objetivo 6)
            const ticketData = {
                pelicula: asiento.funcion.pelicula,
                sala: asiento.funcion.sala,
                asiento: asiento.codigo,
                monto: total,
                vendedor: vendedorNombre
            };
            
            const ticket = TicketFactory.createTicket('MOVIE', ticketData);

            return {
                comprobante: ticket.render(),
                vuelto: vuelto,
                total: total
            };
        });
    }
}