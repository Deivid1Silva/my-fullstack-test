import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false }: Props) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as any;

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/login");
      } else if (adminOnly && user?.role !== "ADMIN") {
        router.push("/home"); 
      }
    }
  }, [session, isPending, router, adminOnly, user]);

  if (isPending || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}