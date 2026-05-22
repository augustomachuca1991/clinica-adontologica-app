import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Icon from "@/components/AppIcon";
import UserManagementCard from "@/pages/settings-panel/components/UserManagementCard";
import PracticeCustomization from "@/pages/settings-panel/components/PracticeCustomization";
import SecurityCompliance from "@/pages/settings-panel/components/SecurityCompliance";
import IntegrationMarketplace from "@/pages/settings-panel/components/IntegrationMarketplace";
import NotificationPreferences from "@/pages/settings-panel/components/NotificationPreferences";
import BackupRestore from "@/pages/settings-panel/components/BackupRestore";
import { useBackup } from "@/hooks/BackupHooks";

const SettingsPanel = () => {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("settings_active_tab") || "users";
  });

  const { backupHistory, fetchBackupHistory } = useBackup();

  // Definición de las pestañas usando las claves de traducción de i18n
  const tabs = [
    {
      id: "users",
      label: t("settings.tabs.users.label"),
      icon: "Users",
      description: t("settings.tabs.users.description"),
    },
    /* {
      id: "practice",
      label: t("settings.tabs.practice.label"),
      icon: "Building",
      description: t("settings.tabs.practice.description"),
    },
    {
      id: "security",
      label: t("settings.tabs.security.label"),
      icon: "Shield",
      description: t("settings.tabs.security.description"),
    },
    {
      id: "integrations",
      label: t("settings.tabs.integrations.label"),
      icon: "Plug",
      description: t("settings.tabs.integrations.description"),
    }, */
    {
      id: "notifications",
      label: t("settings.tabs.notifications.label"),
      icon: "Bell",
      description: t("settings.tabs.notifications.description"),
    },
    {
      id: "backup",
      label: t("settings.tabs.backup.label"),
      icon: "Database",
      description: t("settings.tabs.backup.description"),
    },
  ];

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  useEffect(() => {
    fetchBackupHistory();
  }, [fetchBackupHistory]);

  const lastBackup = backupHistory.find((b) => b.status === "completed");
  const lastBackupDate = lastBackup
    ? new Date(lastBackup.created_at).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const renderTabContent = () => {
    switch (activeTab) {
      case "users":
        return <UserManagementCard />;
      case "practice":
        return <PracticeCustomization />;
      case "security":
        return <SecurityCompliance />;
      case "integrations":
        return <IntegrationMarketplace />;
      case "notifications":
        return <NotificationPreferences />;
      case "backup":
        return <BackupRestore />;
      default:
        return null;
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    localStorage.setItem("settings_active_tab", tabId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-headline font-bold text-foreground mb-2">
            {t("settings.header.title")}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">{t("settings.header.subtitle")}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors duration-base">
            <Icon name="HelpCircle" size={18} />
            <span className="text-sm font-medium">{t("settings.header.helpBtn")}</span>
          </button>
        </div>
      </div>

      {/* Info Notice */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-sm text-foreground mb-1">{t("settings.notice.title")}</h3>
            <p className="text-xs text-muted-foreground">{t("settings.notice.description")}</p>
          </div>
        </div>
      </div>

      {/* Tabs Container */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="border-b border-border overflow-x-auto">
          <div className="flex min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 md:px-6 py-4 text-sm font-medium transition-all duration-base border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon name={tab.icon} size={18} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Header & Body */}
        <div className="p-4 md:p-6">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={currentTab.icon || "Settings"} size={20} color="var(--color-primary)" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-headline font-semibold text-foreground">{currentTab.label}</h2>
                <p className="text-xs md:text-sm text-muted-foreground">{currentTab.description}</p>
              </div>
            </div>
          </div>

          {renderTabContent()}
        </div>
      </div>

      {/* Status Cards Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={16} className="text-success" />
            </div>
            <h4 className="font-medium text-sm text-foreground">{t("settings.status.system.title")}</h4>
          </div>
          <p className="text-xs text-muted-foreground">{t("settings.status.system.value")}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Users" size={16} color="var(--color-primary)" />
            </div>
            <h4 className="font-medium text-sm text-foreground">{t("settings.status.users.title")}</h4>
          </div>
          <p className="text-xs text-muted-foreground">{t("settings.status.users.value")}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Icon name="Database" size={16} className="text-secondary" />
            </div>
            <h4 className="font-medium text-sm text-foreground">{t("settings.status.backup.title")}</h4>
          </div>
          <p className="text-xs text-muted-foreground">
            {lastBackupDate
              ? t("settings.status.backup.lastBackup", { date: lastBackupDate })
              : t("settings.status.backup.value")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
