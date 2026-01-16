import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const SecurityCompliance = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const securityFeatures = [
    {
      id: "two-factor",
      title: "Two-Factor Authentication",
      description: "Require 2FA for all user accounts to enhance security",
      icon: "Shield",
      status: "Enabled",
      enabled: true,
    },
    {
      id: "session-timeout",
      title: "Automatic Session Timeout",
      description: "Log out users after 30 minutes of inactivity",
      icon: "Clock",
      status: "Enabled",
      enabled: true,
    },
    {
      id: "password-policy",
      title: "Strong Password Policy",
      description: "Enforce complex passwords with minimum 12 characters",
      icon: "Key",
      status: "Enabled",
      enabled: true,
    },
    {
      id: "audit-logging",
      title: "Comprehensive Audit Logging",
      description: "Track all system access and data modifications",
      icon: "FileText",
      status: "Active",
      enabled: true,
    },
  ];

  const complianceItems = [
    {
      id: "hipaa",
      title: "HIPAA Compliance",
      description: "Healthcare Insurance Portability and Accountability Act",
      status: "Compliant",
      lastAudit: "01/10/2026",
      icon: "CheckCircle",
      color: "text-success",
    },
    {
      id: "encryption",
      title: "Data Encryption",
      description: "AES-256 encryption for data at rest and in transit",
      status: "Active",
      lastAudit: "01/15/2026",
      icon: "Lock",
      color: "text-success",
    },
    {
      id: "backup",
      title: "Automated Backups",
      description: "Daily encrypted backups with 30-day retention",
      status: "Running",
      lastAudit: "01/16/2026",
      icon: "Database",
      color: "text-success",
    },
    {
      id: "access-control",
      title: "Role-Based Access Control",
      description: "Granular permissions based on user roles",
      status: "Configured",
      lastAudit: "01/12/2026",
      icon: "Users",
      color: "text-success",
    },
  ];

  const auditLogs = [
    {
      id: 1,
      action: "User Login",
      user: "Dr. Sarah Johnson",
      timestamp: "01/16/2026 09:15 AM",
      ipAddress: "192.168.1.100",
      status: "Success",
    },
    {
      id: 2,
      action: "Patient Record Access",
      user: "Dr. Michael Chen",
      timestamp: "01/16/2026 09:30 AM",
      ipAddress: "192.168.1.101",
      status: "Success",
    },
    {
      id: 3,
      action: "Settings Modified",
      user: "Emily Rodriguez",
      timestamp: "01/16/2026 10:00 AM",
      ipAddress: "192.168.1.102",
      status: "Success",
    },
    {
      id: 4,
      action: "Failed Login Attempt",
      user: "Unknown",
      timestamp: "01/16/2026 10:15 AM",
      ipAddress: "203.0.113.45",
      status: "Failed",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {securityFeatures?.map((feature) => (
          <div key={feature?.id} className="bg-card border border-border rounded-lg p-4 hover:shadow-clinical-md transition-all duration-base">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={feature?.icon} size={20} color="var(--color-primary)" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="font-medium text-sm text-foreground">{feature?.title}</h4>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${feature?.enabled ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${feature?.enabled ? "bg-success" : "bg-muted-foreground"}`} />
                    {feature?.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{feature?.description}</p>
                <Button variant="outline" size="sm" className="w-full">
                  Configure
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-headline font-semibold text-base text-foreground">Compliance Status</h4>
          <Button variant="outline" size="sm" iconName="Download">
            Export Report
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
                      Status: <span className={item?.color}>{item?.status}</span>
                    </span>
                    <span className="text-muted-foreground">Last audit: {item?.lastAudit}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-border pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-headline font-semibold text-base text-foreground">Recent Audit Logs</h4>
          <Button variant="outline" size="sm" iconName="ExternalLink">
            View All Logs
          </Button>
        </div>
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Timestamp</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">IP Address</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
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
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${log?.status === "Success" ? "bg-success/10 text-success" : "bg-error/10 text-error"}`}
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
            <h5 className="font-medium text-sm text-foreground mb-1">Security Recommendation</h5>
            <p className="text-xs text-muted-foreground">
              Regular security audits are recommended every 90 days. Your next audit is scheduled for 04/15/2026. Ensure all staff complete security training before the audit date.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityCompliance;
