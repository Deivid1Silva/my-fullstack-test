import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "sonner"; // Importamos el componente de notificaciones

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      {/* Toaster es el contenedor que "escucha" los comandos toast.success() 
          y los muestra físicamente en la pantalla.
      */}
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}