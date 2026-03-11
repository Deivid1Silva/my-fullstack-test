import { NextApiRequest, NextApiResponse } from "next";
import { prisma, auth } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await auth.api.getSession({ headers: new Headers(req.headers as any) });
  if (!session) return res.status(401).json({ error: "No autorizado" });
  const user = session.user as any;

  if (req.method === "GET") {
    const movements = await prisma.movement.findMany({
      include: { user: { select: { name: true } } },
      orderBy: { date: 'desc' }
    });
    return res.status(200).json(movements);
  }

  if (req.method === "POST") {
    if (user.role !== "ADMIN") return res.status(403).json({ error: "Solo administradores pueden crear" });
    const { concept, amount, date } = req.body;
    const numAmount = parseFloat(amount);
    
    const movement = await prisma.movement.create({
      data: {
        concept,
        amount: numAmount,
        date: new Date(date),
        type: numAmount >= 0 ? "INCOME" : "EXPENSE",
        userId: user.id
      }
    });
    return res.status(201).json(movement);
  }

  return res.status(405).end();
}