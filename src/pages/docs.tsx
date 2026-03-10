import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import { Navbar } from "@/components/Navbar";

// Definimos el componente dinámico con el tipo correcto para aceptar 'url'
const SwaggerUI = dynamic<{ url: string }>(
  () => import("swagger-ui-react").then((mod) => mod.default),
  { ssr: false }
);

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="p-4 overflow-hidden">
        {/* Ahora TypeScript reconocerá la prop 'url' */}
        <SwaggerUI url="/api/docs" />
      </div>
    </div>
  );
}