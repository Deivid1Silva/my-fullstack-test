import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

/**
 * @openapi
 * /api/movements:
 * get:
 * description: Obtiene la lista de movimientos financieros
 * responses:
 * 200:
 * description: Arreglo de movimientos exitoso
 * post:
 * description: Crea un nuevo movimiento (Solo ADMIN)
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * concept:
 * type: string
 * amount:
 * type: number
 * date:
 * type: string
 * type:
 * type: string
 * responses:
 * 201:
 * description: Movimiento creado
 * 403:
 * description: No autorizado
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Solución al error de HeadersInit:
    const session = await auth.api.getSession({ 
        headers: new Headers(req.headers as any) 
    });
    
    if (!session) {
        return res.status(401).json({ error: "No autorizado" });
    }

    const user = session.user as any;

    if (req.method === "GET") {
        const movements = await prisma.movement.findMany({
            include: { user: true },
            orderBy: { date: 'desc' }
        });
        return res.status(200).json(movements);
    }

    if (req.method === "POST") {
        const { concept, amount, date, type } = req.body;
        
        if (user.role !== "ADMIN") {
            return res.status(403).json({ error: "Solo administradores pueden crear registros" });
        }

        const newMovement = await prisma.movement.create({
            data: {
                concept,
                amount: parseFloat(amount),
                date: new Date(date),
                type: type || "INCOME",
                userId: session.user.id
            }
        });
        return res.status(201).json(newMovement);
    }
}