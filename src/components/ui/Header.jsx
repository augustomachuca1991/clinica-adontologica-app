import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../AppIcon";
import Button from "./Button";
import LanguageSwitch from "./LanguageSwitch";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { notifyError, notifySuccess } from "../../utils/notifications";

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
    <header className={`fixed top-0 right-0 h-16 bg-card border-b border-border shadow-clinical-sm z-30 transition-all duration-slow ${sidebarCollapsed ? "left-20" : "left-0 lg:left-64"}`}>
      <div className="h-full flex items-center justify-between px-6">
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder={t("search.placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-base"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-3">
          {/* <div className="relative">
            <Button variant="ghost" size="icon" onClick={handleNotificationClick} className="relative" iconName="Bell" aria-label="Notifications" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-error-foreground text-xs font-medium rounded-full flex items-center justify-center">{unreadCount}</span>
            )}

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-lg shadow-clinical-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-border bg-muted/50">
                  <h3 className="font-headline font-semibold text-sm">{t("notifications.title")}</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications?.map((notification) => (
                    <div
                      key={notification?.id}
                      className={`px-4 py-3 border-b border-border hover:bg-muted/50 cursor-pointer transition-colors duration-base ${notification?.unread ? "bg-primary/5" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${notification?.unread ? "bg-primary" : "bg-muted-foreground"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground">{notification?.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification?.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-border bg-muted/50">
                  <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-base">{t("notifications.viewAll")}</button>
                </div>
              </div>
            )}
          </div> */}

          <div className="relative">
            <button onClick={handleUserMenuClick} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors duration-base focus-clinical">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="User" size={18} color="var(--color-primary)" />
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-foregroun capitalize">{fullname}</div>
                <div className="text-xs text-muted-foreground">{displayRole}</div>
              </div>
              <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-lg shadow-clinical-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-border bg-muted/50">
                  <div className="font-medium text-sm text-foreground">{username}</div>
                  <div className="text-xs text-muted-foreground">{userEmail}</div>
                </div>
                <div className="py-2">
                  <Link to="/patient-profile" className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-base">
                    <Icon name="User" size={16} />
                    <span>{t("profileSetting.title")}</span>
                  </Link>
                  {isAdmin && (
                    <Link to="/settings-panel" className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-base">
                      <Icon name="Settings" size={16} />
                      <span>{t("profileSetting.settings")}</span>
                    </Link>
                  )}
                  <button className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-base w-full">
                    <Icon name="HelpCircle" size={16} />
                    <span>{t("profileSetting.help")}</span>
                  </button>
                </div>
                <div className="border-t border-border py-2">
                  <button className="flex items-center gap-3 px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors duration-base w-full" onClick={handleLogout}>
                    <Icon name="LogOut" size={16} />
                    <span>{t("profileSetting.signout")}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          <LanguageSwitch />
        </div>
      </div>
    </header>
  );
};

export default Header;
