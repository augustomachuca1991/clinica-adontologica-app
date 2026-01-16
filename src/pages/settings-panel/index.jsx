import React, { useState } from "react";
import MainLayout from "../../components/ui/MainLayout";
import Icon from "../../components/AppIcon";
import SettingsSection from "./components/SettingsSection";
import UserManagementCard from "./components/UserManagementCard";
import PracticeCustomization from "./components/PracticeCustomization";
import SecurityCompliance from "./components/SecurityCompliance";
import IntegrationMarketplace from "./components/IntegrationMarketplace";
import NotificationPreferences from "./components/NotificationPreferences";
import BackupRestore from "./components/BackupRestore";

const SettingsPanel = () => {
  const [activeTab, setActiveTab] = useState("users");

  const tabs = [
    { id: "users", label: "User Management", icon: "Users", description: "Manage staff accounts and permissions" },
    { id: "practice", label: "Practice Settings", icon: "Building", description: "Customize practice information" },
    { id: "security", label: "Security & Compliance", icon: "Shield", description: "HIPAA compliance and security" },
    { id: "integrations", label: "Integrations", icon: "Plug", description: "Connect third-party services" },
    { id: "notifications", label: "Notifications", icon: "Bell", description: "Configure notification preferences" },
    { id: "backup", label: "Backup & Restore", icon: "Database", description: "Data backup and recovery" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "users":
        return (
          <SettingsSection title="User Management" description="Manage staff accounts, roles, and permissions" icon="Users">
            <UserManagementCard />
          </SettingsSection>
        );
      case "practice":
        return (
          <SettingsSection title="Practice Customization" description="Configure practice information and workflow settings" icon="Building">
            <PracticeCustomization />
          </SettingsSection>
        );
      case "security":
        return (
          <SettingsSection title="Security & Compliance" description="HIPAA compliance, security settings, and audit logs" icon="Shield">
            <SecurityCompliance />
          </SettingsSection>
        );
      case "integrations":
        return (
          <SettingsSection title="Integration Marketplace" description="Connect and manage third-party integrations" icon="Plug">
            <IntegrationMarketplace />
          </SettingsSection>
        );
      case "notifications":
        return (
          <SettingsSection title="Notification Preferences" description="Configure how and when you receive notifications" icon="Bell">
            <NotificationPreferences />
          </SettingsSection>
        );
      case "backup":
        return (
          <SettingsSection title="Backup & Restore" description="Manage data backups and restoration" icon="Database">
            <BackupRestore />
          </SettingsSection>
        );
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-headline font-bold text-foreground mb-2">Settings & Configuration</h1>
            <p className="text-sm md:text-base text-muted-foreground">Manage your practice settings, user accounts, and system preferences</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors duration-base">
              <Icon name="HelpCircle" size={18} />
              <span className="text-sm font-medium">Help</span>
            </button>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm text-foreground mb-1">System Configuration</h3>
              <p className="text-xs text-muted-foreground">
                Configure your DentalCare Manager system to match your practice workflow. Changes to critical settings may require administrator approval and will be logged for compliance.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="border-b border-border overflow-x-auto">
            <div className="flex min-w-max">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 md:px-6 py-4 text-sm font-medium transition-all duration-base border-b-2 whitespace-nowrap ${
                    activeTab === tab?.id ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  <span className="hidden sm:inline">{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 md:p-6">
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={tabs?.find((t) => t?.id === activeTab)?.icon || "Settings"} size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-headline font-semibold text-foreground">{tabs?.find((t) => t?.id === activeTab)?.label}</h2>
                  <p className="text-xs md:text-sm text-muted-foreground">{tabs?.find((t) => t?.id === activeTab)?.description}</p>
                </div>
              </div>
            </div>

            {renderTabContent()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                <Icon name="CheckCircle" size={16} className="text-success" />
              </div>
              <h4 className="font-medium text-sm text-foreground">System Status</h4>
            </div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Users" size={16} color="var(--color-primary)" />
              </div>
              <h4 className="font-medium text-sm text-foreground">Active Users</h4>
            </div>
            <p className="text-xs text-muted-foreground">4 users currently online</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Icon name="Database" size={16} className="text-secondary" />
              </div>
              <h4 className="font-medium text-sm text-foreground">Last Backup</h4>
            </div>
            <p className="text-xs text-muted-foreground">01/16/2026 02:00 AM</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPanel;
