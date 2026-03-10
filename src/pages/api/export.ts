import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const movements = await prisma.movement.findMany({
        orderBy: { date: 'desc' }
    });

    // Cabeceras del CSV
    let csvContent = "Fecha,Concepto,Monto,Tipo\n";

    // Filas
    movements.forEach((m) => {
      const type = Number(m.amount) >= 0 ? "Ingreso" : "Egreso";
      const date = new Date(m.date).toLocaleDateString();
      csvContent += `${date},${m.concept},${m.amount},${type}\n`;
    });

    // Configurar cabeceras de respuesta para descarga
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=reporte_financiero.csv");
    return res.status(200).send(csvContent);
  } catch (error) {
    return res.status(500).json({ error: "Error al exportar" });
  }
}