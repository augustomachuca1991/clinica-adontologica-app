import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@/components/AppIcon";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { notifyError, notifySuccess } from "@/utils/notifications";

const Header = ({ sidebarCollapsed = false }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { t } = useTranslation();
  const { signOut, userProfile, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      notifyError(t("notifications.logoutError"));
      return;
    }
    notifySuccess(t("notifications.logoutSuccess"));
    navigate("/login", { replace: true });
  };

  const username = userProfile?.username || "no especified";
  const userEmail = userProfile?.email || "no especified";
  const fullname = userProfile?.full_name || "no especified";
  const displayRole = isAdmin
    ? t("roles.admin")
    : t(`roles.${userProfile?.user_roles?.[0]?.roles?.name}`) || t("roles.user");

  const notifications = [
    { id: 1, type: "appointment", message: "Upcoming appointment with John Doe in 30 minutes", time: "10 min ago", unread: true },
    { id: 2, type: "alert", message: "Lab results ready for review - Patient #1234", time: "1 hour ago", unread: true },
    { id: 3, type: "system", message: "System maintenance scheduled for tonight", time: "2 hours ago", unread: false },
  ];

  const unreadCount = notifications?.filter((n) => n?.unread)?.length;

  const handleSearch = (e) => { e?.preventDefault(); };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setShowUserMenu(false);
  };

  const handleUserMenuClick = () => {
    setShowUserMenu(!showUserMenu);
    setShowNotifications(false);
  };

  return (
    <header
      className={`fixed top-0 right-0 h-14 z-30 transition-all duration-slow ${
        sidebarCollapsed ? "left-16" : "left-0 lg:left-56"
      }`}
      style={{
        background: "rgba(255, 255, 255, 0.02)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
      }}
    >
      <div className="h-full flex items-center justify-between px-4">
        <div className="flex items-center gap-4 flex-1 max-w-2xl"></div>
        <div className="flex items-center gap-3">
          <LanguageSwitch />
          <div className="relative">
            <button
              onClick={handleUserMenuClick}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-colors duration-base"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <div className="relative w-7 h-7 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="User" size={16} color="var(--color-primary)" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2" style={{ borderColor: "rgba(13,92,99,0.8)" }} />
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-foreground capitalize leading-tight">{fullname}</div>
                <div className="text-[11px] text-muted-foreground leading-tight">{displayRole}</div>
              </div>
              <Icon name="ChevronDown" size={15} className="text-muted-foreground" />
            </button>

            {showUserMenu && (
              <div
                className="absolute right-0 top-full mt-2 w-52 overflow-hidden z-50"
                style={{
                  background: "rgba(13, 92, 99, 0.96)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "12px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                }}
              >
                <div className="flex items-center gap-2.5 px-3.5 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                  <div className="relative w-9 h-9 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="User" size={17} color="var(--color-primary)" />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2" style={{ borderColor: "rgba(13,92,99,0.8)" }} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground capitalize truncate">{fullname}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{userEmail}</div>
                    <span className="inline-flex items-center mt-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium" style={{ background: "rgba(0,240,255,0.12)", color: "#00f0ff" }}>
                      {displayRole}
                    </span>
                  </div>
                </div>
                <div className="py-1.5">
                  <Link to="/patient-profile" className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-[rgba(255,255,255,0.04)] transition-colors duration-base">
                    <Icon name="User" size={15} />
                    <span>{t("profileSetting.title")}</span>
                  </Link>
                  {isAdmin && (
                    <Link to="/settings-panel" className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-base">
                      <Icon name="Settings" size={15} />
                      <span>{t("profileSetting.settings")}</span>
                    </Link>
                  )}
                  <button className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-base w-full">
                    <Icon name="HelpCircle" size={15} />
                    <span>{t("profileSetting.help")}</span>
                  </button>
                </div>
                <div className="border-t py-1.5" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                  <button className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-error hover:bg-error/10 transition-colors duration-base w-full" onClick={handleLogout}>
                    <Icon name="LogOut" size={15} />
                    <span>{t("profileSetting.signout")}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
