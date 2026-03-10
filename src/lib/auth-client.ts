import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    // Agregamos la definición del usuario para que TS no se queje
    user: {
        additionalFields: {
            role: {
                type: "string"
            }
        }
    }
});