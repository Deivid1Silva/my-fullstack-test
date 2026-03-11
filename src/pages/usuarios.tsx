import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Edit, Users, Shield } from "lucide-react";
import { toast } from "sonner";

export default function UsuariosPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [newName, setNewName] = useState("");
    const [newRole, setNewRole] = useState("");

    const fetchUsers = async () => {
        const res = await fetch("/api/users");
        const data = await res.json();
        if (Array.isArray(data)) setUsers(data);
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleEditClick = (user: any) => {
        setEditingUser(user);
        setNewName(user.name);
        setNewRole(user.role);
    };

    const handleUpdate = async () => {
        const res = await fetch("/api/users", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editingUser.id, name: newName, role: newRole })
        });

        if (res.ok) {
            toast.success("Usuario actualizado correctamente");
            setEditingUser(null);
            fetchUsers();
        } else {
            toast.error("Error al actualizar");
        }
    };

    return (
        <ProtectedRoute adminOnly>
            <div className="min-h-screen bg-[#f8fafc]">
                <Navbar />
                <main className="max-w-6xl mx-auto p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <Users className="w-8 h-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-slate-900">Gestión de Usuarios</h1>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Correo Electrónico</TableHead>
                                    <TableHead>Rol</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((u) => (
                                    <TableRow key={u.id} className="hover:bg-slate-50/50">
                                        <TableCell className="font-medium">{u.name}</TableCell>
                                        <TableCell>{u.email}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {u.role}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => handleEditClick(u)}>
                                                <Edit className="w-4 h-4 mr-2" /> Editar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Modal de Edición */}
                    <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-blue-600" /> Editar Permisos
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nombre Completo</label>
                                    <Input value={newName} onChange={(e) => setNewName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Asignar Rol</label>
                                    <select 
                                        className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm"
                                        value={newRole} 
                                        onChange={(e) => setNewRole(e.target.value)}
                                    >
                                        <option value="USER">Usuario (Solo consulta)</option>
                                        <option value="ADMIN">Administrador (Control total)</option>
                                    </select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setEditingUser(null)}>Cancelar</Button>
                                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleUpdate}>Guardar Cambios</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </main>
            </div>
        </ProtectedRoute>
    );
}