import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Spinner from "./ui/Spinner";

const PrivateRoute = () => {
  const location = useLocation();
  const { isAuthenticated, loading, userProfile, hasActiveSubscription, isLoggedIn } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <Spinner size={56} />
      </div>
    );
  }

  // 1️⃣ Usuario no logueado → login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 2️⃣ Usuario logueado con subscripción activa
  if (hasActiveSubscription) {
    // Evitar que pueda ir a /subscription-expired
    if (location.pathname === "/subscription-expired") {
      return <Navigate to="/dashboard" replace />;
    }
    return <Outlet />; // rutas privadas normales
  }

  // 3️⃣ Usuario logueado sin subscripción activa → solo puede ver /subscription-expired
  if (location.pathname !== "/subscription-expired") {
    return <Navigate to="/subscription-expired" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
