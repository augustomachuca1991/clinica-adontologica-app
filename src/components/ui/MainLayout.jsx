import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Breadcrumbs from "./Breadcrumbs";

const MainLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={handleSidebarToggle} />

      <div className={`transition-all duration-slow ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}`}>
        <Header sidebarCollapsed={sidebarCollapsed} />

        <main className="pt-16">
          <div className="container mx-auto px-6 py-8">
            <Breadcrumbs />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
