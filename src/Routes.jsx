import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import PatientProfile from "./pages/patient-profile";
import SettingsPanel from "./pages/settings-panel";
import Dashboard from "./pages/dashboard";
import TreatmentPlanning from "./pages/treatment-planning";
import PatientDirectory from "./pages/patient-directory";
import ClinicalRecords from "./pages/clinical-records";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Define your route here */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/patient-profile" element={<PatientProfile />} />
          <Route path="/settings-panel" element={<SettingsPanel />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/treatment-planning" element={<TreatmentPlanning />} />
          <Route path="/patient-directory" element={<PatientDirectory />} />
          <Route path="/clinical-records" element={<ClinicalRecords />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
