import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import ErrorBoundary from "@/components/ErrorBoundary";
import PatientProfile from "@/pages/patient-profile";
import SettingsPanel from "@/pages/settings-panel";
import Dashboard from "@/pages/dashboard";
import TreatmentPlanning from "@/pages/treatment-planning";
import PatientDirectory from "@/pages/patient-directory";
import ClinicalRecords from "@/pages/clinical-records";
import Login from "@/pages/login";
import PrivateRoute from "@/components/auth/PrivateRoute";
import MainLayout from "@/components/ui/MainLayout";
import SubscriptionExpired from "@/pages/subscription-expired";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import WeeklyCalendar from "@/pages/weekly-calendar";
import RoleGuard from "@/components/auth/RoleGuard";
import PublicRoute from "@/components/auth/PublicRoute";
import Terms from "@/pages/terms";
import AdminPanel from "@/pages/admin-panel";

const Routes = () => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* ================= PUBLIC ================= */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* ================= PRIVATE ================= */}
          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
              {/* RUTAS DE DENTISTA/STAFF PROTEGIDAS POR ROL */}
              <Route element={<RoleGuard allowedRoles={["dentist"]} />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/patient-directory" element={<PatientDirectory />} />
                <Route path="/patient-profile/:id?" element={<PatientProfile />} />
                <Route path="/treatment-planning" element={<TreatmentPlanning />} />
                <Route path="/clinical-records" element={<ClinicalRecords />} />
                <Route path="/weekly-calendar" element={<WeeklyCalendar />} />
              </Route>

              {/* GRUPO ADMINISTRATIVO: Solo para Admins */}
              <Route element={<RoleGuard allowedRoles={["admin"]} />}>
                <Route path="/admin-panel" element={<AdminPanel />} />
                <Route path="/settings-panel" element={<SettingsPanel />} />
              </Route>
            </Route>

            {/* Rutas privadas especiales sin layout */}
            <Route path="/subscription-expired" element={<SubscriptionExpired />} />
          </Route>

          <Route path="/terms" element={<Terms />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
