import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import ErrorBoundary from "@/components/ErrorBoundary";
import PrivateRoute from "@/components/auth/PrivateRoute";
import MainLayout from "@/components/ui/MainLayout";
import RoleGuard from "@/components/auth/RoleGuard";
import PublicRoute from "@/components/auth/PublicRoute";
import Spinner from "@/components/ui/Spinner";

const Login = lazy(() => import("@/pages/login"));
const ForgotPassword = lazy(() => import("@/pages/forgot-password"));
const ResetPassword = lazy(() => import("@/pages/reset-password"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const PatientDirectory = lazy(() => import("@/pages/patient-directory"));
const PatientProfile = lazy(() => import("@/pages/patient-profile"));
const TreatmentPlanning = lazy(() => import("@/pages/treatment-planning"));
const ClinicalRecords = lazy(() => import("@/pages/clinical-records"));
const WeeklyCalendar = lazy(() => import("@/pages/weekly-calendar"));
const ClinicalNotes = lazy(() => import("@/pages/clinical-notes"));
const AdminPanel = lazy(() => import("@/pages/admin-panel"));
const SettingsPanel = lazy(() => import("@/pages/settings-panel"));
const SubscriptionExpired = lazy(() => import("@/pages/subscription-expired"));
const Terms = lazy(() => import("@/pages/terms"));

const PageSuspense = ({ children }) => (
  <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-muted/40"><Spinner size={64} /></div>}>
    {children}
  </Suspense>
);

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
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<PageSuspense><Login /></PageSuspense>} />
            <Route path="/forgot-password" element={<PageSuspense><ForgotPassword /></PageSuspense>} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
              <Route element={<RoleGuard allowedRoles={["dentist"]} />}>
                <Route path="/dashboard" element={<PageSuspense><Dashboard /></PageSuspense>} />
                <Route path="/patient-directory" element={<PageSuspense><PatientDirectory /></PageSuspense>} />
                <Route path="/patient-profile/:id?" element={<PageSuspense><PatientProfile /></PageSuspense>} />
                <Route path="/treatment-planning" element={<PageSuspense><TreatmentPlanning /></PageSuspense>} />
                <Route path="/clinical-records" element={<PageSuspense><ClinicalRecords /></PageSuspense>} />
                <Route path="/weekly-calendar" element={<PageSuspense><WeeklyCalendar /></PageSuspense>} />
                <Route path="/clinical-notes" element={<PageSuspense><ClinicalNotes /></PageSuspense>} />
              </Route>

              <Route element={<RoleGuard allowedRoles={["admin"]} />}>
                <Route path="/admin-panel" element={<PageSuspense><AdminPanel /></PageSuspense>} />
                <Route path="/settings-panel" element={<PageSuspense><SettingsPanel /></PageSuspense>} />
              </Route>
            </Route>

            <Route path="/subscription-expired" element={<PageSuspense><SubscriptionExpired /></PageSuspense>} />
          </Route>

          <Route path="/terms" element={<PageSuspense><Terms /></PageSuspense>} />
          <Route path="/reset-password" element={<PageSuspense><ResetPassword /></PageSuspense>} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;