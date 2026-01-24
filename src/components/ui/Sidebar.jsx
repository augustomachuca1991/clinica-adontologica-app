import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "../AppIcon";
import Image from "../AppImage";
import logo from "../../../public/assets/images/logo-orion-software.svg";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = ({ isCollapsed = false, onToggle }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const { userProfile, isAdmin } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const appName = import.meta.env.VITE_APP_NAME || "Orion Software";

  // Extraemos roles para saber qué mostrar
  const roles = userProfile?.user_roles?.map((ur) => ur.roles?.name) || [];
  const isDentist = roles.includes("dentist"); // Asegúrate que el nombre coincida con tu DB

  const navigationItems = [
    {
      path: "/dashboard",
      label: "dashboard.title",
      icon: "LayoutDashboard",
      description: "dashboard.description",
      roles: ["dentist"],
    },
    {
      path: "/patient-directory",
      label: "directory.title",
      icon: "Users",
      description: "directory.description",
      roles: ["dentist"],
    },
    {
      path: "/clinical-records",
      label: "records.title",
      icon: "FileText",
      description: "records.description",
      roles: ["dentist"],
    },
    {
      path: "/treatment-planning",
      label: "treatment.title",
      icon: "Calendar",
      description: "treatment.description",
      roles: ["dentist"],
    },
    {
      path: "/patient-profile",
      label: "profile.title",
      icon: "User",
      description: "profile.description",
      roles: ["dentist"],
    },
    {
      path: "/settings-panel",
      label: "settings.title",
      icon: "Settings",
      description: "settings.description",
      roles: ["admin"],
    },
  ];

  const visibleItems = navigationItems.filter((item) => item.roles.some((role) => roles.includes(role)));

  const isActive = (path) => location?.pathname === path;

  const handleMobileToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      <button onClick={handleMobileToggle} className="fixed top-3.5 left-4 z-50 lg:hidden bg-card text-foreground p-2 rounded-md shadow-clinical-md focus-clinical" aria-label="Toggle mobile menu">
        <Icon name={isMobileOpen ? "X" : "Menu"} size={18} />
      </button>
      <div
        className={`fixed lg:fixed top-0 left-0 h-full bg-card border-r border-border shadow-clinical-md transition-all duration-slow z-40 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "w-20" : "w-64"}`}
      >
        <div
          className="sidebar-header flex items-center justify-center h-16 border-b border-border bg-primary/5 backdrop-blur-sm"
          onClick={() => navigate(isAdmin ? "/admin-panel" : "/dashboard")}
          role="button"
          aria-label="Go to home"
        >
          <div className={`sidebar-logo flex items-center justify-center transition-all duration-slow ${isCollapsed ? "w-10 h-10" : "w-12 h-12"} bg-primary/10 rounded-lg`}>
            {/* <Icon name="Activity" size={isCollapsed ? 20 : 24} color="var(--color-primary)" /> */}
            <Image src={logo} alt="App Logo" className={`object-contain ${isCollapsed ? "h-14 w-14" : "h-10 w-10"}`} />
          </div>
          {!isCollapsed && <span className="ml-1 text-lg font-headline font-bold text-foreground tracking-[-0.015em]">{appName}</span>}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            {visibleItems?.map((item) => (
              <li key={item?.path}>
                <Link
                  to={item?.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-base group ${
                    isActive(item?.path) ? "bg-primary text-primary-foreground shadow-clinical-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  title={isCollapsed ? t(item?.label) : ""}
                >
                  <Icon name={item?.icon} size={20} className={`flex-shrink-0 transition-transform duration-base ${isActive(item?.path) ? "scale-110" : "group-hover:scale-105"}`} />
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{t(item?.label)}</div>
                      {!isActive(item?.path) && <div className="text-xs opacity-70 truncate">{t(item.description)}</div>}
                    </div>
                  )}
                  {isActive(item?.path) && !isCollapsed && <div className="w-1 h-6 bg-primary-foreground rounded-full" />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-border p-4">
          <button
            onClick={onToggle}
            className="hidden lg:flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-all duration-base focus-clinical"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Icon name={isCollapsed ? "ArrowRightToLine" : "ArrowLeftToLine"} size={20} />
            {!isCollapsed && <span className="ml-2">{t("sidebar.toggle")}</span>}
          </button>
        </div>
      </div>
      {isMobileOpen && <div className="fixed inset-0 bg-background z-30 lg:hidden" onClick={closeMobileMenu} aria-hidden="true" />}
    </>
  );
};

export default Sidebar;
