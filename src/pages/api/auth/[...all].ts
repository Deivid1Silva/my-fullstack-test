import { auth } from "@/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. Construimos la URL completa para evitar el error ERR_INVALID_URL
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers.host;
  const url = new URL(req.url || "", `${protocol}://${host}`);

  // 2. Creamos la Web Request
  const request = new Request(url.toString(), {
    method: req.method,
    headers: new Headers(req.headers as any),
    // Solo enviamos el cuerpo si no es GET o HEAD
    body: req.method !== "GET" && req.method !== "HEAD" ? JSON.stringify(req.body) : undefined,
  });

  // 3. Ejecutamos el handler de Better Auth
  const response = await auth.handler(request);

  // 4. Devolvemos la respuesta al cliente
  res.status(response.status);
  
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  const text = await response.text();
  return res.send(text);
}