// components/ui/Sidebar.jsx
import React, { useState, useCallback, useMemo, memo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Icon from "@/components/AppIcon";
import Image from "@/components/AppImage";
import logo from "@/assets/images/orion-logotipo-claro-600.svg";
import logoIsotipo from "@/assets/images/orion-isotipo-transparente.svg";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/utils/cn";

// ── Constantes estáticas ──────────────────────────────────────────────────────

const NAVIGATION_ITEMS = [
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
    path: "/weekly-calendar",
    label: "calendar.title",
    icon: "Calendar",
    description: "calendar.subtitle",
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
  {
    path: "/admin-panel",
    label: "subscription.title",
    icon: "subscription",
    description: "subscription.description",
    roles: ["admin"],
  },
];

const APP_NAME = import.meta.env.VITE_APP_NAME || "Orion Software";

// ── NavItem ───────────────────────────────────────────────────────────────────

const NavItem = memo(({ item, isActive, isCollapsed, onClick, t }) => (
  <li style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
    <Link
      to={item.path}
      onClick={onClick}
      title={isCollapsed ? t(item.label) : undefined}
      className={cn(
        "flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-base group",
        isActive
          ? "text-[#00f0ff] bg-[rgba(0,240,255,0.08)]"
          : "text-[rgba(255,255,255,0.6)] hover:text-[rgba(255,255,255,0.9)] hover:bg-[rgba(255,255,255,0.04)]"
      )}
    >
      <Icon
        name={item.icon}
        size={20}
        className={cn(
          "flex-shrink-0 transition-transform duration-base",
          isActive ? "scale-110" : "group-hover:scale-105"
        )}
      />
      {!isCollapsed && (
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{t(item.label)}</div>
          {!isActive && <div className="text-xs opacity-60 truncate">{t(item.description)}</div>}
        </div>
      )}
      {isActive && !isCollapsed && (
        <span className="text-[#00f0ff] text-lg font-light">›</span>
      )}
    </Link>
  </li>
));
NavItem.displayName = "NavItem";

// ── Sidebar ───────────────────────────────────────────────────────────────────

const Sidebar = ({ isCollapsed = false, onToggle }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const { userProfile, isAdmin } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const roles = useMemo(() => userProfile?.user_roles?.map((ur) => ur.roles?.name) ?? [], [userProfile]);

  const visibleItems = useMemo(
    () => NAVIGATION_ITEMS.filter((item) => item.roles.some((r) => roles.includes(r))),
    [roles]
  );

  const isActive = useCallback((path) => location.pathname === path, [location.pathname]);

  const handleHomeClick = useCallback(() => {
    navigate(isAdmin ? "/admin-panel" : "/dashboard");
  }, [navigate, isAdmin]);

  const openMobileMenu = useCallback(() => setIsMobileOpen(true), []);
  const closeMobileMenu = useCallback(() => setIsMobileOpen(false), []);

  return (
    <>
      {/* ── Botón hamburguesa (solo visible cuando sidebar está cerrado) ── */}
      {!isMobileOpen && (
        <button
          onClick={openMobileMenu}
          className="fixed top-3.5 left-4 z-50 lg:hidden bg-card text-foreground p-2 rounded-md shadow-clinical-md focus-clinical"
          aria-label="Abrir menú"
        >
          <Icon name="Menu" size={18} />
        </button>
      )}

      {/* ── Sidebar panel ── */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full transition-all duration-700 ease-in-out z-40",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "w-16" : "w-56"
        )}
        style={{
          background: "rgba(13, 92, 99, 0.94)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRight: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "0 16px 16px 0",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        {/* HEADER */}
        <div
          className="relative flex items-center justify-center h-12 cursor-pointer"
          onClick={handleHomeClick}
          role="button"
          aria-label="Ir al inicio"
          style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}
        >
          <Image src={isCollapsed ? logoIsotipo : logo} alt={`${APP_NAME} Logo`} className="h-10 w-auto" />

          {/* Botón X dentro del header, solo en mobile cuando está abierto */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeMobileMenu();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 lg:hidden p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Cerrar menú"
          >
            <Icon name="X" size={18} />
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            {visibleItems.map((item) => (
              <NavItem
                key={item.path}
                item={item}
                isActive={isActive(item.path)}
                isCollapsed={isCollapsed}
                onClick={closeMobileMenu}
                t={t}
              />
            ))}
          </ul>
        </nav>

        {/* FOOTER — collapse toggle (solo desktop) */}
        <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)" }} className="p-4">
          <button
            onClick={onToggle}
            className="hidden lg:flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.8)] hover:bg-[rgba(255,255,255,0.04)] rounded-md transition-all duration-base focus-clinical"
            aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            <Icon name={isCollapsed ? "ArrowRightToLine" : "ArrowLeftToLine"} size={20} />
            {!isCollapsed && <span className="ml-2">{t("sidebar.toggle")}</span>}
          </button>
        </div>
      </div>

      {/* ── Overlay mobile ── */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-background/80 z-30 lg:hidden" onClick={closeMobileMenu} aria-hidden="true" />
      )}
    </>
  );
};

export default Sidebar;
