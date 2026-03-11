import { Navbar } from "@/components/Navbar";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wallet, Users, BarChart3, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f8fafc]">
        <Navbar />
        <main className="max-w-6xl mx-auto p-12">
          <header className="mb-12 text-center md:text-left">
            <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">Finanzas Pro</h1>
            <p className="text-slate-500 text-xl max-w-2xl">Bienvenido al ecosistema de gestión administrativa. Control total sobre tus activos y usuarios.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <MenuCard href="/movimientos" title="Movimientos" desc="Registro de caja, ingresos y egresos." icon={<Wallet className="w-6 h-6 text-blue-600" />} color="blue" />
            <MenuCard href="/usuarios" title="Usuarios" desc="Control de roles y permisos del sistema." icon={<Users className="w-6 h-6 text-emerald-600" />} color="emerald" />
            <MenuCard href="/reportes" title="Reportes" desc="Analítica visual y exportación de datos." icon={<BarChart3 className="w-6 h-6 text-purple-600" />} color="purple" />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function MenuCard({ href, title, desc, icon, color }: any) {
  const colors: any = { blue: "bg-blue-50", emerald: "bg-emerald-50", purple: "bg-purple-50" };
  return (
    <Link href={href} className="group">
      <Card className="h-full border-slate-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:ring-2 hover:ring-indigo-500/20">
        <CardHeader>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${colors[color]}`}>{icon}</div>
          <CardTitle className="text-2xl flex items-center gap-2 group-hover:text-indigo-600 transition-colors">{title} <ArrowRight className="w-4 h-4" /></CardTitle>
          <CardDescription className="text-slate-500 text-md pt-3">{desc}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}