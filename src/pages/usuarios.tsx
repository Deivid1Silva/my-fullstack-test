import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Edit2, Users, ShieldCheck, Mail } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function UsuariosPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [open, setOpen] = useState(false);

    const fetchUsers = () => {
        fetch("/api/users").then(res => res.json()).then(data => { if (Array.isArray(data)) setUsers(data); });
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const res = await fetch("/api/users", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: selectedUser.id,
                name: formData.get("name"),
                role: formData.get("role")
            })
        });

        if (res.ok) {
            toast.success("Usuario actualizado con éxito");
            setOpen(false);
            fetchUsers();
        } else {
            toast.error("Error al actualizar");
        }
    };

    return (
        <ProtectedRoute adminOnly>
            {/* 🔧 Forzar color de texto base oscuro */}
            <div className="min-h-screen bg-[#f8fafc] text-slate-900">
                <Navbar />
                <main className="max-w-6xl mx-auto p-8">
                    <div className="mb-10">
                        <h2 className="text-3xl font-extrabold text-slate-950 flex items-center gap-3">
                            <Users className="text-indigo-600 w-9 h-9" /> Administración de Personal
                        </h2>
                        <p className="text-slate-600 mt-2">Administra los roles y permisos de acceso.</p>
                    </div>

                    {/* Tabla Corregida (Visibilidad) */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ring-1 ring-slate-200/50">
                        <Table>
                            <TableHeader className="bg-slate-50/80">
                                <TableRow>
                                    {/* 🔧 Forzar color oscuro en los encabezados */}
                                    <TableHead className="font-semibold text-slate-900 py-4">Nombre Completo</TableHead>
                                    <TableHead className="font-semibold text-slate-900 flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400"/> Correo</TableHead>
                                    <TableHead className="font-semibold text-slate-900">Rol Sistema</TableHead>
                                    <TableHead className="font-semibold text-slate-900 text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((u) => (
                                    <TableRow key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                        {/* 🔧 Forzar color oscuro en las celdas */}
                                        <TableCell className="font-semibold text-slate-800 py-4">{u.name}</TableCell>
                                        <TableCell className="text-slate-600">{u.email}</TableCell>
                                        <TableCell>
                                            {u.role === "ADMIN" ? (
                                                <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100 flex w-fit items-center gap-1 shadow-none">
                                                    <ShieldCheck className="w-3.5 h-3.5" /> {u.role}
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-slate-600 border-slate-200">
                                                    {u.role}
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {/* Requisito: Formulario de edición */}
                                            <Dialog open={open && selectedUser?.id === u.id} onOpenChange={(val) => {setOpen(val); if(val) setSelectedUser(u)}}>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="text-slate-700 hover:bg-indigo-50 hover:text-indigo-600">
                                                        <Edit2 className="w-4 h-4 mr-2" /> Editar Permisos
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <DialogHeader>
                                                        <DialogTitle>Actualizar Usuario</DialogTitle>
                                                    </DialogHeader>
                                                    <form onSubmit={handleUpdate} className="space-y-4 pt-4">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-semibold text-slate-700">Nombre Completo</label>
                                                            <Input name="name" defaultValue={u.name} required className="text-slate-900"/>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-semibold text-slate-700">Asignar Rol</label>
                                                            {/* select estándar para mayor legibilidad */}
                                                            <select name="role" defaultValue={u.role} className="w-full border rounded-md p-2 bg-white text-slate-900 text-sm">
                                                                <option value="USER">USER</option>
                                                                <option value="ADMIN">ADMIN</option>
                                                            </select>
                                                        </div>
                                                        <Button type="submit" className="w-full bg-indigo-600 text-lg">Guardar Cambios</Button>
                                                    </form>
                                                </DialogContent>
                                            </Dialog>
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