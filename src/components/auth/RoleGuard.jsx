import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext"; // Asegúrate de tener tu hook de auth

const RoleGuard = ({ children, allowedRoles }) => {
  // CAMBIO: Antes decía 'profile', debe decir 'userProfile'
  const { userProfile, loading, isAdmin } = useAuth();

  if (loading)
    return <div className="p-10 text-center">Verificando permisos...</div>;

  // Ahora 'userProfile' ya tiene datos, extraemos los roles
  const userRoles = userProfile?.user_roles?.map((ur) => ur.roles?.name) || [];
  const hasAccess = allowedRoles.some((role) => userRoles.includes(role));

  if (!hasAccess) {
    return isAdmin ? (
      <Navigate to="/admin-panel" replace />
    ) : (
      <Navigate to="/dashboard" replace />
    );
  }

  return children ? children : <Outlet />;
};

export default RoleGuard;
