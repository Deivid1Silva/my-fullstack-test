import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PlusCircle, FileDown, Search, ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function MovimientosPage() {
    const { data: session } = authClient.useSession();
    const user = session?.user as any;
    const [movements, setMovements] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchMovements = async () => {
        const res = await fetch("/api/movements");
        const data = await res.json();
        if (Array.isArray(data)) setMovements(data);
    };

    useEffect(() => { fetchMovements(); }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const payload = Object.fromEntries(formData);

        const res = await fetch("/api/movements", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            toast.success("Movimiento registrado");
            setOpen(false);
            fetchMovements();
        } else {
            toast.error("Error al guardar");
        }
        setLoading(false);
    };

    const filteredMovements = movements.filter(m => 
        m.concept.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#f8fafc] text-slate-900">
                <Navbar />
                <main className="max-w-6xl mx-auto p-8">
                    {/* Header Mejorado */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight flex items-center gap-3">
                                <TrendingUp className="text-indigo-600" /> Movimientos Financieros
                            </h1>
                            <p className="text-slate-600 mt-1">Historial completo de ingresos y gastos.</p>
                        </div>
                        
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => window.location.href = '/api/export'} className="bg-white border-slate-200">
                                <FileDown className="mr-2 h-4 w-4" /> Exportar CSV
                            </Button>
                            
                            {/* Requisito: Botón "Nuevo" solo para ADMIN */}
                            {user?.role === "ADMIN" && (
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100">
                                            <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Movimiento
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Registrar Transacción</DialogTitle>
                                            <DialogDescription>Asegúrate de poner montos negativos para los gastos.</DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                                            <Input name="concept" placeholder="Ej: Pago de nómina" required className="text-slate-900" />
                                            <Input name="amount" type="number" step="0.01" placeholder="Monto (Ej: -500)" required className="text-slate-900" />
                                            <Input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="text-slate-900" />
                                            <Button type="submit" className="w-full bg-indigo-600 text-lg" disabled={loading}>
                                                {loading ? "Procesando..." : "Confirmar"}
                                            </Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    </div>

                    {/* Tabla Corregida (Requisito y Visibilidad) */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ring-1 ring-slate-200/50">
                        <Table>
                            <TableHeader className="bg-slate-50/80">
                                <TableRow>
                                    {/* 🔧 Forzar color oscuro en los encabezados */}
                                    <TableHead className="font-semibold text-slate-900 py-4">Concepto</TableHead>
                                    <TableHead className="font-semibold text-slate-900">Tipo</TableHead>
                                    <TableHead className="font-semibold text-slate-900 text-right">Monto</TableHead>
                                    <TableHead className="font-semibold text-slate-900">Fecha</TableHead>
                                    <TableHead className="font-semibold text-slate-900">Usuario</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMovements.map((m) => (
                                    <TableRow key={m.id} className="hover:bg-slate-50/50">
                                        {/* 🔧 Forzar color oscuro en las celdas */}
                                        <TableCell className="font-medium text-slate-800 py-4">{m.concept}</TableCell>
                                        <TableCell>
                                            {Number(m.amount) >= 0 ? 
                                                <Badge className="bg-emerald-50 text-emerald-700">Ingreso</Badge> : 
                                                <Badge className="bg-rose-50 text-rose-700">Gasto</Badge>
                                            }
                                        </TableCell>
                                        <TableCell className={`text-right font-bold text-lg ${Number(m.amount) >= 0 ? "text-emerald-600" : "text-slate-900"}`}>
                                            ${Number(m.amount).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-slate-600 font-medium">
                                            {new Date(m.date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-slate-500 italic text-sm">
                                            {m.user?.name || "Administrador"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}