import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405).end();

    try {
        const movements = await prisma.movement.findMany();

        const data = [
            { name: "Ingresos", value: 0, fill: "#22c55e" },
            { name: "Egresos", value: 0, fill: "#ef4444" },
        ];

        movements.forEach((m: any) => {
            const amount = Number(m.amount);
            if (amount >= 0) {
                data[0].value += amount;
            } else {
                data[1].value += Math.abs(amount);
            }
        });

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: "Error al calcular estadísticas" });
    }
}