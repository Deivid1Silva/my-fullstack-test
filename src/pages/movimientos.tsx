import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Download } from "lucide-react";

export default function MovimientosPage() {
    const { data: session } = authClient.useSession();
    const user = session?.user as any; 
    const [movements, setMovements] = useState<any[]>([]); 
    const [open, setOpen] = useState(false);

    const fetchMovements = async () => {
        const res = await fetch("/api/movements");
        const data = await res.json();
        if (Array.isArray(data)) setMovements(data);
    };

    useEffect(() => { fetchMovements(); }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const payload = Object.fromEntries(formData);
        
        await fetch("/api/movements", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...payload })
        });

        setOpen(false);
        fetchMovements();
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-50 text-slate-900">
                <Navbar />
                <main className="max-w-6xl mx-auto p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">Gestión de Movimientos</h2>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => window.location.href = '/api/export'} className="flex gap-2">
                                <Download className="w-4 h-4" /> Exportar
                            </Button>
                            {user?.role === "ADMIN" && (
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Nuevo Movimiento</Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-white">
                                        <DialogHeader><DialogTitle>Agregar Movimiento</DialogTitle></DialogHeader>
                                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                                            <Input name="concept" placeholder="Concepto" required />
                                            <Input name="amount" type="number" placeholder="Monto (negativo para egresos)" required />
                                            <Input name="date" type="date" required />
                                            <Button type="submit" className="w-full bg-blue-600 text-white">Guardar</Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow border border-slate-200">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Concepto</TableHead>
                                    <TableHead>Monto</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Usuario</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {movements.map((m: any) => (
                                    <TableRow key={m.id}>
                                        <TableCell className="font-medium text-slate-700">{m.concept}</TableCell>
                                        <TableCell className={Number(m.amount) >= 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                                            ${Number(m.amount).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-slate-600">{new Date(m.date).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-slate-500 text-xs">{m.user?.name || "Sistema"}</TableCell>
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