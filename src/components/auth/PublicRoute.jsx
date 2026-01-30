import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Spinner from "@/components/ui/Spinner";

const PublicRoute = () => {
  const { isLoggedIn, loading, isAdmin, hasActiveSubscription } = useAuth();

  // 1. Mientras el contexto carga (perfil, suscripción, sesión), mostramos carga
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <Spinner size={56} />
      </div>
    );
  }

  // 2. Si YA está logueado, lo sacamos de aquí
  if (isLoggedIn) {
    if (isAdmin) return <Navigate to="/admin-panel" replace />;
    if (hasActiveSubscription) return <Navigate to="/dashboard" replace />;
    return <Navigate to="/subscription-expired" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
