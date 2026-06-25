import React, { useState } from "react";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";
import { useTranslation } from "react-i18next";

const SecurityCompliance = () => {
  const { t } = useTranslation();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const securityFeatures = [
    {
      id: "two-factor",
      title: t("security.features.twoFactor"),
      description: t("security.features.twoFactorDesc"),
      icon: "Shield",
      status: t("security.status.enabled"),
      enabled: true,
    },
    {
      id: "session-timeout",
      title: t("security.features.sessionTimeout"),
      description: t("security.features.sessionTimeoutDesc"),
      icon: "Clock",
      status: t("security.status.enabled"),
      enabled: true,
    },
    {
      id: "password-policy",
      title: t("security.features.passwordPolicy"),
      description: t("security.features.passwordPolicyDesc"),
      icon: "Key",
      status: t("security.status.enabled"),
      enabled: true,
    },
    {
      id: "audit-logging",
      title: t("security.features.auditLogging"),
      description: t("security.features.auditLoggingDesc"),
      icon: "FileText",
      status: t("security.status.active"),
      enabled: true,
    },
  ];

  const complianceItems = [
    {
      id: "hipaa",
      title: t("security.compliance.hipaa"),
      description: t("security.compliance.hipaaDesc"),
      status: t("security.status.compliant"),
      lastAudit: "01/10/2026",
      icon: "CheckCircle",
      color: "text-success",
    },
    {
      id: "encryption",
      title: t("security.compliance.encryption"),
      description: t("security.compliance.encryptionDesc"),
      status: t("security.status.active"),
      lastAudit: "01/15/2026",
      icon: "Lock",
      color: "text-success",
    },
    {
      id: "backup",
      title: t("security.compliance.backup"),
      description: t("security.compliance.backupDesc"),
      status: t("security.status.running"),
      lastAudit: "01/16/2026",
      icon: "Database",
      color: "text-success",
    },
    {
      id: "access-control",
      title: t("security.compliance.accessControl"),
      description: t("security.compliance.accessControlDesc"),
      status: t("security.status.configured"),
      lastAudit: "01/12/2026",
      icon: "Users",
      color: "text-success",
    },
  ];

  const auditLogs = [
    {
      id: 1,
      action: t("security.audit.actionLogin"),
      user: "Dr. Sarah Johnson",
      timestamp: "01/16/2026 09:15 AM",
      ipAddress: "192.168.1.100",
      status: t("security.status.success"),
    },
    {
      id: 2,
      action: t("security.audit.actionRecordAccess"),
      user: "Dr. Michael Chen",
      timestamp: "01/16/2026 09:30 AM",
      ipAddress: "192.168.1.101",
      status: t("security.status.success"),
    },
    {
      id: 3,
      action: t("security.audit.actionSettingsModified"),
      user: "Emily Rodriguez",
      timestamp: "01/16/2026 10:00 AM",
      ipAddress: "192.168.1.102",
      status: t("security.status.success"),
    },
    {
      id: 4,
      action: t("security.audit.actionFailedLogin"),
      user: t("common.unknown"),
      timestamp: "01/16/2026 10:15 AM",
      ipAddress: "203.0.113.45",
      status: t("security.status.failed"),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {securityFeatures?.map((feature) => (
          <div
            key={feature?.id}
            className="bg-card border border-border rounded-lg p-4 hover:shadow-clinical-md transition-all duration-base"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={feature?.icon} size={20} color="var(--color-primary)" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="font-medium text-sm text-foreground">{feature?.title}</h4>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${feature?.enabled ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${feature?.enabled ? "bg-success" : "bg-muted-foreground"}`} />
                    {feature?.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{feature?.description}</p>
                <Button variant="outline" size="sm" className="w-full">
                  {t("common.configure")}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-headline font-semibold text-base text-foreground">{t("security.complianceStatus")}</h4>
          <Button variant="outline" size="sm" iconName="Download">
            {t("security.exportReport")}
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {complianceItems?.map((item) => (
            <div key={item?.id} className="bg-muted/30 border border-border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Icon name={item?.icon} size={20} className={item?.color} />
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-sm text-foreground mb-1">{item?.title}</h5>
                  <p className="text-xs text-muted-foreground mb-2">{item?.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {t("security.statusLabel")} <span className={item?.color}>{item?.status}</span>
                    </span>
                    <span className="text-muted-foreground">{t("security.lastAudit")} {item?.lastAudit}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-border pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-headline font-semibold text-base text-foreground">{t("security.recentAuditLogs")}</h4>
          <Button variant="outline" size="sm" iconName="ExternalLink">
            {t("security.viewAllLogs")}
          </Button>
        </div>
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("security.table.action")}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("security.table.user")}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("security.table.timestamp")}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("security.table.ipAddress")}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("security.table.status")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {auditLogs?.map((log) => (
                  <tr key={log?.id} className="hover:bg-muted/30 transition-colors duration-base">
                    <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">{log?.action}</td>
                    <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">{log?.user}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{log?.timestamp}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap font-mono">{log?.ipAddress}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${log?.status === t("security.status.success") ? "bg-success/10 text-success" : "bg-error/10 text-error"}`}
                      >
                        {log?.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="AlertTriangle" size={20} className="text-warning flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-medium text-sm text-foreground mb-1">{t("security.recommendation")}</h5>
            <p className="text-xs text-muted-foreground">
              {t("security.recommendationDesc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityCompliance;
