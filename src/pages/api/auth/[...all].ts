import { auth } from "@/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers.host;
  const url = new URL(req.url || "", `${protocol}://${host}`);

  const request = new Request(url.toString(), {
    method: req.method,
    headers: new Headers(req.headers as any),
    body: req.method !== "GET" && req.method !== "HEAD" ? JSON.stringify(req.body) : undefined,
  });

  const response = await auth.handler(request);

  res.status(response.status);
  
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  const text = await response.text();
  return res.send(text);
}