import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

export default function ReportesPage() {
    const [data, setData] = useState<{stats: any[], balance: number}>({ stats: [], balance: 0 });

    useEffect(() => {
        fetch("/api/stats")
            .then(res => res.json())
            .then(json => setData(json));
    }, []);

    return (
        <ProtectedRoute adminOnly>
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <main className="max-w-6xl mx-auto p-6">
                    <h2 className="text-2xl font-bold mb-6">Analítica Financiera</h2>
                    
                    {/* KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <Card className="border-l-4 border-l-blue-500">
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-slate-500">Saldo Actual</p>
                                        <h3 className="text-2xl font-bold">${data.balance.toLocaleString()}</h3>
                                    </div>
                                    <Wallet className="text-blue-500 w-8 h-8 opacity-20" />
                                </div>
                            </CardContent>
                        </Card>
                        {data.stats.map((s) => (
                            <Card key={s.name} className={`border-l-4 ${s.name === 'Ingresos' ? 'border-l-emerald-500' : 'border-l-rose-500'}`}>
                                <CardContent className="pt-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-slate-500">Total {s.name}</p>
                                            <h3 className="text-2xl font-bold">${s.value.toLocaleString()}</h3>
                                        </div>
                                        {s.name === 'Ingresos' ? <TrendingUp className="text-emerald-500 w-8 h-8 opacity-20" /> : <TrendingDown className="text-rose-500 w-8 h-8 opacity-20" />}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="bg-white">
                        <CardHeader>
                            <CardTitle>Flujo de Caja</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.stats}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{fill: '#f8fafc'}} />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={80}>
                                        {data.stats.map((entry, index) => (
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