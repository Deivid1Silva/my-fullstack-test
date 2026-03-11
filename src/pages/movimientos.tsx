import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PlusCircle, FileDown } from "lucide-react";
import { toast } from "sonner";

export default function MovimientosPage() {
    const { data: session } = authClient.useSession();
    const user = session?.user as any;
    const [movements, setMovements] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

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

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <main className="max-w-6xl mx-auto p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Movimientos</h1>
                            <p className="text-slate-500 text-sm">Historial completo de ingresos y gastos.</p>
                        </div>
                        
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => window.location.href = '/api/export'} className="shadow-sm">
                                <FileDown className="mr-2 h-4 w-4" /> Exportar
                            </Button>
                            
                            {user?.role === "ADMIN" && (
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                                            <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Movimiento
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Nuevo Registro</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Concepto</label>
                                                <Input name="concept" placeholder="Ej: Pago de servicios" required />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Monto</label>
                                                <Input name="amount" type="number" step="0.01" placeholder="Ej: -50.00 (gasto) o 100.00 (ingreso)" required />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Fecha</label>
                                                <Input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
                                            </div>
                                            <Button type="submit" className="w-full" disabled={loading}>
                                                {loading ? "Guardando..." : "Confirmar Registro"}
                                            </Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead>Concepto</TableHead>
                                    <TableHead>Monto</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Registrado por</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {movements.map((m) => (
                                    <TableRow key={m.id} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="font-medium">{m.concept}</TableCell>
                                        <TableCell className={`font-bold ${Number(m.amount) >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                                            {Number(m.amount) >= 0 ? "+" : ""}${Math.abs(Number(m.amount)).toLocaleString()}
                                        </TableCell>
                                        <TableCell>{new Date(m.date).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-slate-500">{m.user?.name || "Admin"}</TableCell>
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