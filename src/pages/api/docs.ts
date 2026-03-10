import { NextApiRequest, NextApiResponse } from "next";
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FinanzasApp API",
      version: "1.0.0",
      description: "Documentación de la prueba técnica - Gestión de Movimientos y Usuarios",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  // Ojo: apunta a donde tengas tus APIs. 
  // En Next.js Pages Router suelen estar en src/pages/api/*.ts
  apis: ["./src/pages/api/**/*.ts"], 
};

const spec = swaggerJsdoc(options);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(spec);
}