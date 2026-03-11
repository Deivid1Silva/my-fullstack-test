import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button"; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; 
import { Github } from "lucide-react";

export default function LoginPage() {
  const handleGithubLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/home", 
      });
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-900">
      <Card className="w-[400px] shadow-lg border-slate-200">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Bienvenido</CardTitle>
          <CardDescription>
            Usa tu cuenta de GitHub para acceder al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            className="w-full h-12 text-lg font-medium flex items-center justify-center gap-2" 
            onClick={handleGithubLogin}
          >
            <Github className="h-5 w-5" />
            Ingresar con GitHub
          </Button>
          <p className="mt-4 text-[10px] text-center text-slate-500 uppercase tracking-wider font-semibold">
            Configuración: Rol ADMIN automático
          </p>
        </CardContent>
      </Card>
    </div>
  );
}