import { Navbar } from "@/components/Navbar";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wallet, Users, BarChart3 } from "lucide-react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <main className="max-w-6xl mx-auto p-8">
          <h2 className="text-3xl font-bold mb-8 text-slate-800">Panel de Control</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/movimientos">
              <Card className="hover:border-blue-500 cursor-pointer transition-all bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <Wallet className="w-10 h-10 text-blue-500 mb-2" />
                  <CardTitle>Gestión Financiera</CardTitle>
                  <CardDescription>Registra tus ingresos y gastos diarios.</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/usuarios">
              <Card className="hover:border-green-500 cursor-pointer transition-all bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <Users className="w-10 h-10 text-green-500 mb-2" />
                  <CardTitle>Gestión de Usuarios</CardTitle>
                  <CardDescription>Administra los permisos y roles del sistema.</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/reportes">
              <Card className="hover:border-purple-500 cursor-pointer transition-all bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <BarChart3 className="w-10 h-10 text-purple-500 mb-2" />
                  <CardTitle>Reportes</CardTitle>
                  <CardDescription>Visualiza el estado de tus finanzas en gráficos.</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}