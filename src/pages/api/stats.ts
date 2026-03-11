import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405).end();

    try {
        const movements = await prisma.movement.findMany();
        
        let ingresos = 0;
        let egresos = 0;

        movements.forEach((m) => {
            const val = Number(m.amount);
            if (val >= 0) ingresos += val;
            else egresos += Math.abs(val);
        });

        const stats = [
            { name: "Ingresos", value: ingresos, fill: "#22c55e" },
            { name: "Egresos", value: egresos, fill: "#ef4444" }
        ];


        const balance = ingresos - egresos;

        return res.status(200).json({ stats, balance });
    } catch (error) {
        return res.status(500).json({ error: "Error en el servidor" });
    }
}