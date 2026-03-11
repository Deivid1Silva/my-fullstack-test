import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Wallet, TrendingUp, TrendingDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReportesPage() {
    const [data, setData] = useState<any>({ stats: [], balance: 0 });

    useEffect(() => {
        fetch("/api/stats").then(res => res.json()).then(json => setData(json));
    }, []);

    return (
        <ProtectedRoute adminOnly>
            <div className="min-h-screen bg-[#fcfcfd]">
                <Navbar />
                <main className="max-w-6xl mx-auto p-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Análisis Financiero</h1>
                            <p className="text-slate-500">Balance general y comportamiento de flujos.</p>
                        </div>
                        <Button 
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100"
                            onClick={() => window.location.href = '/api/export'}
                        >
                            <Download className="w-4 h-4 mr-2" /> Descargar CSV
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card className="border-none shadow-sm ring-1 ring-slate-200">
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Saldo Neto Actual</p>
                                        <h3 className="text-2xl font-bold text-slate-900">${data.balance?.toLocaleString()}</h3>
                                    </div>
                                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><Wallet /></div>
                                </div>
                            </CardContent>
                        </Card>
                        {/* Agrega más StatCards aquí si lo deseas */}
                    </div>

                    <Card className="border-none shadow-md">
                        <CardHeader className="bg-slate-50/50 border-b">
                            <CardTitle className="text-slate-700 text-lg">Distribución de Ingresos vs Egresos</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[400px] pt-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.stats}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{fill: '#f8fafc'}} />
                                    <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={80}>
                                        {data.stats.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </ProtectedRoute>
    );
}