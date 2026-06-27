import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class MovieService {
    // BR-3: Validar disponibilidad y bloqueo temporal
    async purchaseTicket(asientoId, strategy, cashReceived) {
        return await prisma.$transaction(async (tx) => {
            const asiento = await tx.asiento.findUnique({
                where: { id: asientoId },
                include: { funcion: true }
            });

            const now = new Date();
            const lockDuration = 5 * 60 * 1000; // 5 minutos
            const isLocked = asiento.estado === 'bloqueado' && (now - asiento.bloqueadoEn < lockDuration);

            if (asiento.estado === 'vendido' || isLocked) {
                throw new Error("El asiento no está disponible.");
            }

            const finalPrice = strategy.calculate(asiento.funcion.precioBase);
            if (cashReceived < finalPrice) throw new Error("Dinero insuficiente.");

            const updatedAsiento = await tx.asiento.update({
                where: { id: asientoId },
                data: { estado: 'vendido', bloqueadoEn: null }
            });

            return {
                total: finalPrice,
                vuelto: cashReceived - finalPrice,
                ticket: `TICKET: ${asiento.funcion.pelicula} | Asiento: ${asiento.codigo}`
            };
        });
    }
}