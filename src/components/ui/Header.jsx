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
    ? t("roles.admin") // O simplemente "Administrador"
    : t(`roles.${userProfile?.user_roles?.[0]?.roles?.name}`) || t("roles.user");

  const notifications = [
    {
      id: 1,
      type: "appointment",
      message: "Upcoming appointment with John Doe in 30 minutes",
      time: "10 min ago",
      unread: true,
    },
    {
      id: 2,
      type: "alert",
      message: "Lab results ready for review - Patient #1234",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      type: "system",
      message: "System maintenance scheduled for tonight",
      time: "2 hours ago",
      unread: false,
    },
  ];

  const unreadCount = notifications?.filter((n) => n?.unread)?.length;

  const handleSearch = (e) => {
    e?.preventDefault();
    console.log("Searching for:", searchQuery);
  };

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
      className={`fixed top-0 right-0 h-16 bg-card border-b border-border shadow-clinical-sm z-30 transition-all duration-slow ${sidebarCollapsed ? "left-20" : "left-0 lg:left-64"}`}
    >
      <div className="h-full flex items-center justify-between px-6">
        <div className="flex items-center gap-4 flex-1 max-w-2xl"></div>
        <div className="flex items-center gap-3">
          <LanguageSwitch />
          <div className="relative">
            <button
              onClick={handleUserMenuClick}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:border-border/80 bg-card transition-colors duration-base focus-clinical"
            >
              {/* Avatar con estado */}
              <div className="relative w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="User" size={16} color="var(--color-primary)" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-card" />
              </div>

              {/* Nombre y rol */}
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-foreground capitalize leading-tight">{fullname}</div>
                <div className="text-[11px] text-muted-foreground leading-tight">{displayRole}</div>
              </div>

              <Icon name="ChevronDown" size={15} className="text-muted-foreground" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-clinical-lg overflow-hidden z-50">
                {/* Header con info completa */}
                <div className="flex items-center gap-2.5 px-3.5 py-3 border-b border-border">
                  <div className="relative w-9 h-9 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="User" size={17} color="var(--color-primary)" />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-card" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground capitalize truncate">{fullname}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{userEmail}</div>
                    <span className="inline-flex items-center mt-0.5 px-1.5 py-0.5 rounded-full bg-muted text-primary text-[10px] font-medium">
                      {displayRole}
                    </span>
                  </div>
                </div>

                {/* Links */}
                <div className="py-1.5">
                  <Link
                    to="/patient-profile"
                    className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-base"
                  >
                    <Icon name="User" size={15} />
                    <span>{t("profileSetting.title")}</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/settings-panel"
                      className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-base"
                    >
                      <Icon name="Settings" size={15} />
                      <span>{t("profileSetting.settings")}</span>
                    </Link>
                  )}
                  <button className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-base w-full">
                    <Icon name="HelpCircle" size={15} />
                    <span>{t("profileSetting.help")}</span>
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-border py-1.5">
                  <button
                    className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-error hover:bg-error/10 transition-colors duration-base w-full"
                    onClick={handleLogout}
                  >
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
