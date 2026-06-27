import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const app = express();
const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'semana9_cine_key';

app.use(cors());
app.use(express.json());

// --- MIDDLEWARE DE SEGURIDAD (Objetivo 1) ---
const verificarAcceso = (rolesPermitidos) => {
    return (req, res, next) => {
        const token = req.headers['authorization']?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "No autorizado" });

        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            if (!rolesPermitidos.includes(decoded.rol)) {
                return res.status(403).json({ error: "Permisos insuficientes" });
            }
            req.user = decoded;
            next();
        } catch (err) {
            res.status(401).json({ error: "Token inválido" });
        }
    };
};

// --- ENDPOINT: LOGIN (Objetivo 1) ---
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    // En una demo real, buscarías en la DB con: prisma.usuarios.findUnique(...)
    if (password === "123456") {
        const token = jwt.sign({ email, rol: 'VENDEDOR' }, SECRET_KEY);
        res.json({ token, rol: 'VENDEDOR' });
    } else {
        res.status(401).json({ error: "Credenciales incorrectas" });
    }
});

// --- ENDPOINT: VENTA Y BLOQUEO (Objetivo 3 y 4) ---
app.post('/api/ventas/comprar', verificarAcceso(['VENDEDOR', 'ADMIN']), async (req, res) => {
    const { asientoId, pagoEfectivo } = req.body;

    try {
        const resultado = await prisma.$transaction(async (tx) => {
            const asiento = await tx.asiento.findUnique({ where: { id: asientoId } });
            
            // Regla BR-3: Bloqueo de 5 min
            const ahora = new Date();
            const esBloqueado = asiento.estado === 'bloqueado' && (ahora - asiento.bloqueadoEn < 300000);

            if (asiento.estado === 'vendido' || esBloqueado) {
                throw new Error("Asiento no disponible");
            }

            const total = 5000; // Precio base simulado
            const vuelto = pagoEfectivo - total;

            await tx.asiento.update({
                where: { id: asientoId },
                data: { estado: 'vendido', bloqueadoEn: null }
            });

            return { total, vuelto };
        });

        res.json({ success: true, ...resultado });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.listen(3001, () => console.log("✅ SGC Backend en puerto 3001"));