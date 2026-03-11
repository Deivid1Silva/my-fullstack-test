import { NextApiRequest, NextApiResponse } from "next";
import { prisma, auth } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
            select: { id: true, name: true, email: true, role: true, createdAt: true },
            orderBy: { createdAt: "desc" }
        });
        return res.status(200).json(users);
    }


    if (req.method === "PUT") {
        const { id, name, role } = req.body;
        if (!id || !name || !role) {
            return res.status(400).json({ error: "Faltan campos" });
        }
        try {
            const updated = await prisma.user.update({
                where: { id },
                data: { name, role }
            });
            return res.status(200).json(updated);
        } catch (error) {
            return res.status(500).json({ error: "Error al actualizar" });
        }
    }

    return res.status(405).json({ error: "Método no permitido" });
}