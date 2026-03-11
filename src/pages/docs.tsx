import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import { Navbar } from "@/components/Navbar";

const SwaggerUI = dynamic<{ url: string }>(
  () => import("swagger-ui-react").then((mod) => mod.default),
  { ssr: false }
);

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="p-4 overflow-hidden">
        <SwaggerUI url="/api/docs" />
      </div>
    </div>
  );
}