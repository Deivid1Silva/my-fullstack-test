import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function UsuariosPage() {
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/users")
            .then(res => res.json())
            .then(data => { if (Array.isArray(data)) setUsers(data); });
    }, []);

    return (
        <ProtectedRoute adminOnly>
            <div className="min-h-screen bg-slate-50 text-slate-900">
                <Navbar />
                <main className="max-w-6xl mx-auto p-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Administración de Usuarios</h2>
                    <div className="bg-white rounded-lg shadow border border-slate-200">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Rol</TableHead>
                                    <TableHead>Fecha</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((u) => (
                                    <TableRow key={u.id}>
                                        <TableCell className="font-medium text-slate-700">{u.name}</TableCell>
                                        <TableCell className="text-slate-600">{u.email}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                u.role === "ADMIN" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700"
                                            }`}>
                                                {u.role}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-slate-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</TableCell>
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