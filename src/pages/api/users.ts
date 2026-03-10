import { NextApiRequest, NextApiResponse } from "next";
import { prisma, auth } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Convertimos IncomingHttpHeaders a Headers de Fetch API
    const reqHeaders = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
        if (value) reqHeaders.append(key, Array.isArray(value) ? value.join(", ") : value);
    });

    const session = await auth.api.getSession({ headers: reqHeaders });
    const user = session?.user as any;

    if (!session || user?.role !== "ADMIN") {
        return res.status(403).json({ error: "No autorizado" });
    }

    if (req.method === "GET") {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" }
        });
        return res.status(200).json(users);
    }

    return res.status(405).json({ error: "Método no permitido" });
}