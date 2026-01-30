import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Spinner from "@/components/ui/Spinner";

const PrivateRoute = () => {
  const location = useLocation();
  const {
    isAuthenticated,
    loading,
    isAdmin,
    hasActiveSubscription,
    isLoggedIn,
  } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <Spinner size={56} />
      </div>
    );
  }

  // 2. Si no está logueado, afuera
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  // 3. SI ES ADMIN: Acceso total (Bypass de suscripción)
  if (isAdmin) {
    if (location.pathname === "/subscription-expired") {
      return <Navigate to="/dashboard" replace />;
    }
    return <Outlet />;
  }

  // 4. SI ES DENTISTA/STAFF: Validamos suscripción
  if (hasActiveSubscription) {
    if (location.pathname === "/subscription-expired") {
      return <Navigate to="/dashboard" replace />;
    }
    return <Outlet />;
  }

  // 5. SI NO ES NINGUNO: A la pantalla de error
  if (location.pathname !== "/subscription-expired") {
    return <Navigate to="/subscription-expired" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
