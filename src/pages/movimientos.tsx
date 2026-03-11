import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PlusCircle, FileDown, ArrowUpCircle, ArrowDownCircle, Search } from "lucide-react";
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
            toast.success("Movimiento registrado con éxito");
            setOpen(false);
            fetchMovements();
        } else {
            toast.error("Error al guardar el registro");
        }
        setLoading(false);
    };

    const filteredMovements = movements.filter(m => 
        m.concept.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#f8fafc]">
                <Navbar />
                <main className="max-w-6xl mx-auto p-8">
                    {/* Header con Acciones */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Movimientos</h1>
                            <p className="text-slate-500 mt-1">Gestiona el flujo de caja en tiempo real.</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input 
                                    placeholder="Buscar concepto..." 
                                    className="pl-10 bg-white border-slate-200"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            <Button variant="outline" onClick={() => window.location.href = '/api/export'} className="bg-white border-slate-200 hover:bg-slate-50 shadow-sm">
                                <FileDown className="mr-2 h-4 w-4" /> Exportar
                            </Button>
                            
                            {user?.role === "ADMIN" && (
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95">
                                            <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Registro
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle className="text-xl">Nuevo Movimiento</DialogTitle>
                                            <DialogDescription>Completa los detalles de la transacción financiera.</DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700">Concepto</label>
                                                <Input name="concept" placeholder="Ej: Pago de servidor AWS" required className="border-slate-200 focus:ring-indigo-500" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700">Monto</label>
                                                <Input name="amount" type="number" step="0.01" placeholder="Ej: -50000 o 120000" required className="border-slate-200" />
                                                <p className="text-[10px] text-slate-400 italic">* Use valores negativos para gastos y positivos para ingresos.</p>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700">Fecha</label>
                                                <Input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="border-slate-200" />
                                            </div>
                                            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 py-6 text-lg" disabled={loading}>
                                                {loading ? "Procesando..." : "Guardar Movimiento"}
                                            </Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    </div>

                    {/* Tabla Estilizada */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ring-1 ring-slate-200/50">
                        <Table>
                            <TableHeader className="bg-slate-50/80">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-semibold text-slate-600 py-4">Concepto</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Tipo</TableHead>
                                    <TableHead className="font-semibold text-slate-600 text-right">Monto</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Fecha</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Registrado por</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMovements.length > 0 ? (
                                    filteredMovements.map((m) => (
                                        <TableRow key={m.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <TableCell className="font-medium text-slate-900 py-4">{m.concept}</TableCell>
                                            <TableCell>
                                                {Number(m.amount) >= 0 ? (
                                                    <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-100 flex w-fit items-center gap-1 shadow-none">
                                                        <ArrowUpCircle className="w-3 h-3" /> Ingreso
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-100 flex w-fit items-center gap-1 shadow-none">
                                                        <ArrowDownCircle className="w-3 h-3" /> Gasto
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className={`text-right font-bold text-lg ${Number(m.amount) >= 0 ? "text-emerald-600" : "text-slate-900"}`}>
                                                {Number(m.amount) >= 0 ? "+" : "-"}${Math.abs(Number(m.amount)).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-slate-500 font-medium">
                                                {new Date(m.date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </TableCell>
                                            <TableCell className="text-slate-400 italic text-sm">
                                                {m.user?.name || "Administrador"}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-48 text-center text-slate-400">
                                            No se encontraron movimientos registrados.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}