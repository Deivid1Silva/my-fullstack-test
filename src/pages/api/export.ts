import { NextApiRequest, NextApiResponse } from "next";
import { prisma, auth } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const reqHeaders = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
        if (value) reqHeaders.append(key, Array.isArray(value) ? value.join(", ") : value);
    });

    const session = await auth.api.getSession({ headers: reqHeaders });
    if (!session || (session.user as any).role !== "ADMIN") {
        return res.status(403).end();
    }

    const movements = await prisma.movement.findMany({
        include: { user: { select: { name: true } } },
        orderBy: { date: 'desc' }
    });

    const header = "Fecha,Concepto,Monto,Tipo,Usuario\n";
    const rows = movements.map(m => (
        `${m.date.toISOString().split('T')[0]},"${m.concept}",${m.amount},${m.type},"${m.user?.name || 'Sistema'}"`
    )).join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=reporte_financiero.csv");
    return res.status(200).send(header + rows);
}