import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  const { data: session } = authClient.useSession();
  const user = session?.user as any;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  if (!mounted) {
    return <nav className="p-4 bg-white border-b shadow-sm h-[73px]"></nav>;
  }

  const initial = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <nav className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
      <div className="flex gap-6 items-center text-slate-900">
        <h1 className="font-bold text-xl text-blue-600 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">F</div>
          FinanzasApp
        </h1>
        <div className="hidden md:flex gap-4">
          <Link href="/home" className="text-sm font-medium hover:text-blue-600 transition-colors">Inicio</Link>
          <Link href="/movimientos" className="text-sm font-medium hover:text-blue-600 transition-colors">Gestión</Link>
          {user?.role === "ADMIN" && (
            <>
              <Link href="/usuarios" className="text-sm font-medium hover:text-blue-600 transition-colors">Usuarios</Link>
              <Link href="/reportes" className="text-sm font-medium hover:text-blue-600 transition-colors">Reportes</Link>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end hidden sm:flex">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            {user?.name || "Usuario"}
          </span>
          <span className="text-[10px] text-slate-500">{user?.email}</span>
        </div>
        
        <div className="w-9 h-9 bg-slate-200 border border-slate-300 rounded-full flex items-center justify-center font-bold text-slate-600 shadow-sm">
          {initial}
        </div>

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout}
          className="text-slate-500 hover:text-red-600 hover:bg-red-50"
        >
          Salir
        </Button>
      </div>
    </nav>
  );
}