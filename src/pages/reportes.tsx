import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function ReportesPage() {
    const [mounted, setMounted] = useState(false);
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        setMounted(true);
        fetch("/api/stats")
            .then(res => res.json())
            .then(json => {
                if (Array.isArray(json)) {
                    setData(json);
                }
            })
            .catch(err => console.error("Error al cargar estadísticas:", err));
    }, []);

    // Evita errores de hidratación en Next.js
    if (!mounted) return null;

    return (
        <ProtectedRoute adminOnly>
            <div className="min-h-screen bg-slate-50 text-slate-900">
                <Navbar />
                <main className="max-w-6xl mx-auto p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Reporte Financiero Global</h2>
                            <p className="text-sm text-slate-500">Visualización de ingresos y egresos totales.</p>
                        </div>
                        <Button 
                            onClick={() => window.location.href = '/api/export'} 
                            className="bg-green-600 hover:bg-green-700 text-white flex gap-2 shadow-sm transition-all active:scale-95"
                        >
                           <Download className="w-4 h-4" /> 
                           Exportar Datos (CSV)
                        </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Gráfico Ocupando 2 columnas en pantallas grandes */}
                        <Card className="lg:col-span-2 bg-white border-slate-200 shadow-sm overflow-hidden">
                            <CardHeader className="border-b border-slate-50">
                                <CardTitle className="text-lg font-semibold text-slate-700">Balance Comparativo</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#64748b', fontSize: 12 }}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#64748b', fontSize: 12 }}
                                            tickFormatter={(value) => `$${value.toLocaleString()}`}
                                        />
                                        <Tooltip 
                                            cursor={{ fill: '#f8fafc' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Monto"]}
                                        />
                                        <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={60}>
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Tarjetas de Resumen en 1 columna */}
                        <div className="flex flex-col gap-4">
                            {data.length > 0 ? data.map((item) => (
                                <Card key={item.name} className="bg-white shadow-sm border-slate-200 hover:border-slate-300 transition-colors">
                                    <CardContent className="p-6 flex justify-between items-center">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.name}</p>
                                            <p className="text-2xl font-bold text-slate-800 italic">
                                                ${item.value.toLocaleString()}
                                            </p>
                                        </div>
                                        <div 
                                            className="w-1.5 h-12 rounded-full" 
                                            style={{ backgroundColor: item.fill }} 
                                        />
                                    </CardContent>
                                </Card>
                            )) : (
                                <div className="h-full flex items-center justify-center text-slate-400 italic text-sm border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
                                    Cargando datos del servidor...
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}