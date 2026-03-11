import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

/**
 * @openapi
 * /api/movements:
 * get:
 * description: Obtiene la lista de movimientos financieros
 * post:
 * description: Crea un nuevo movimiento (Solo ADMIN)
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await auth.api.getSession({ 
        headers: new Headers(req.headers as any) 
    });
    
    if (!session) return res.status(401).json({ error: "No autorizado" });

    if (req.method === "GET") {
        try {
            const movements = await prisma.movement.findMany({
                include: { user: { select: { name: true } } },
                orderBy: { date: 'desc' }
            });
            return res.status(200).json(movements);
        } catch (error) {
            return res.status(500).json({ error: "Error al obtener movimientos" });
        }
    }

    if (req.method === "POST") {
        const user = session.user as any;
        if (user.role !== "ADMIN") {
            return res.status(403).json({ error: "Privilegios insuficientes" });
        }

        const { concept, amount, date, type } = req.body;

        if (!concept || !amount || !date) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }

        try {
            const newMovement = await prisma.movement.create({
                data: {
                    concept,
                    amount: parseFloat(amount),
                    date: new Date(date),
                    type: type || (parseFloat(amount) >= 0 ? "INCOME" : "EXPENSE"),
                    userId: session.user.id
                }
            });
            return res.status(201).json(newMovement);
        } catch (error) {
            return res.status(500).json({ error: "Error al crear el movimiento" });
        }
    }

    return res.status(405).json({ error: "Método no permitido" });
}