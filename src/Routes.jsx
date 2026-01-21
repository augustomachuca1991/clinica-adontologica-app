import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import PatientProfile from "./pages/patient-profile";
import SettingsPanel from "./pages/settings-panel";
import Dashboard from "./pages/dashboard";
import TreatmentPlanning from "./pages/treatment-planning";
import PatientDirectory from "./pages/patient-directory";
import ClinicalRecords from "./pages/clinical-records";
import Login from "./pages/login";
import PrivateRoute from "./components/PrivateRoute";
import MainLayout from "./components/ui/MainLayout";
import SubscriptionExpired from "./pages/subscription-expired";
import ForgotPassword from "./pages/forgot-password";
import ResetPassword from "./pages/reset-password";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* ================= PUBLIC ================= */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ================= PRIVATE ================= */}
          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/patient-directory" element={<PatientDirectory />} />
              <Route path="/patient-profile/:id?" element={<PatientProfile />} />
              <Route path="/treatment-planning" element={<TreatmentPlanning />} />
              <Route path="/clinical-records" element={<ClinicalRecords />} />
              <Route path="/settings-panel" element={<SettingsPanel />} />
            </Route>

            {/* Rutas privadas especiales sin layout */}
            <Route path="/subscription-expired" element={<SubscriptionExpired />} />
          </Route>

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
