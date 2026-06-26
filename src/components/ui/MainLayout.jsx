import React, { useState } from "react";
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { t } = useTranslation();

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:text-sm focus:font-medium focus:outline-none"
      >
        {t("common.skipToContent") || "Skip to content"}
      </a>

      <Sidebar isCollapsed={sidebarCollapsed} onToggle={handleSidebarToggle} />

      <div
        className={`transition-all duration-slow ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}`}
      >
        <Header sidebarCollapsed={sidebarCollapsed} />

        <main id="main-content" tabIndex={-1} className="pt-16 focus:outline-none">
          <div className="container mx-auto px-6 py-8">
            <Breadcrumbs />
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
