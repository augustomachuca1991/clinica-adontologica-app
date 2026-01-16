import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import { Checkbox } from "../../../components/ui/Checkbox";

const BackupRestore = () => {
  const [backupFrequency, setBackupFrequency] = useState("daily");
  const [retentionPeriod, setRetentionPeriod] = useState("30");

  const frequencyOptions = [
    { value: "hourly", label: "Every hour" },
    { value: "daily", label: "Daily at 2:00 AM" },
    { value: "weekly", label: "Weekly on Sunday" },
    { value: "monthly", label: "Monthly on 1st" },
  ];

  const retentionOptions = [
    { value: "7", label: "7 days" },
    { value: "30", label: "30 days" },
    { value: "90", label: "90 days" },
    { value: "365", label: "1 year" },
  ];

  const backupHistory = [
    {
      id: 1,
      date: "01/16/2026",
      time: "02:00 AM",
      size: "2.4 GB",
      status: "Completed",
      type: "Automatic",
      duration: "12 minutes",
    },
    {
      id: 2,
      date: "01/15/2026",
      time: "02:00 AM",
      size: "2.3 GB",
      status: "Completed",
      type: "Automatic",
      duration: "11 minutes",
    },
    {
      id: 3,
      date: "01/14/2026",
      time: "10:30 AM",
      size: "2.3 GB",
      status: "Completed",
      type: "Manual",
      duration: "10 minutes",
    },
    {
      id: 4,
      date: "01/14/2026",
      time: "02:00 AM",
      size: "2.2 GB",
      status: "Completed",
      type: "Automatic",
      duration: "11 minutes",
    },
    {
      id: 5,
      date: "01/13/2026",
      time: "02:00 AM",
      size: "2.2 GB",
      status: "Failed",
      type: "Automatic",
      duration: "2 minutes",
    },
  ];

  const dataCategories = [
    { id: "patient-records", label: "Patient Records", size: "1.2 GB", checked: true },
    { id: "clinical-notes", label: "Clinical Notes", size: "450 MB", checked: true },
    { id: "images", label: "Clinical Images", size: "600 MB", checked: true },
    { id: "appointments", label: "Appointments", size: "80 MB", checked: true },
    { id: "billing", label: "Billing Data", size: "120 MB", checked: true },
    { id: "settings", label: "System Settings", size: "5 MB", checked: true },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Database" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <h4 className="font-headline font-semibold text-base text-foreground">Backup Configuration</h4>
              <p className="text-xs text-muted-foreground">Automated backup settings</p>
            </div>
          </div>
          <div className="space-y-4">
            <Select label="Backup Frequency" options={frequencyOptions} value={backupFrequency} onChange={setBackupFrequency} description="How often backups are created" />
            <Select label="Retention Period" options={retentionOptions} value={retentionPeriod} onChange={setRetentionPeriod} description="How long backups are kept" />
            <div className="pt-2">
              <Button variant="default" className="w-full" iconName="Save">
                Save Configuration
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={20} className="text-success" />
            </div>
            <div>
              <h4 className="font-headline font-semibold text-base text-foreground">Backup Status</h4>
              <p className="text-xs text-muted-foreground">Current backup information</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Last Backup</span>
              <span className="text-sm font-medium text-foreground">01/16/2026 02:00 AM</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Backup Size</span>
              <span className="text-sm font-medium text-foreground">2.4 GB</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Next Scheduled</span>
              <span className="text-sm font-medium text-foreground">01/17/2026 02:00 AM</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Storage Used</span>
              <span className="text-sm font-medium text-foreground">68.5 GB / 100 GB</span>
            </div>
            <div className="pt-2">
              <Button variant="outline" className="w-full" iconName="Download">
                Create Manual Backup
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="font-headline font-semibold text-base text-foreground mb-4">Data Categories</h4>
        <p className="text-sm text-muted-foreground mb-4">Select which data categories to include in backups</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dataCategories?.map((category) => (
            <div key={category?.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
              <Checkbox checked={category?.checked} onChange={() => {}} className="mt-0.5" />
              <div className="flex-1 min-w-0">
                <label className="font-medium text-sm text-foreground cursor-pointer block">{category?.label}</label>
                <p className="text-xs text-muted-foreground">{category?.size}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-muted/30 border-b border-border">
          <div className="flex items-center justify-between">
            <h4 className="font-headline font-semibold text-base text-foreground">Backup History</h4>
            <Button variant="outline" size="sm" iconName="Download">
              Export List
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {backupHistory?.map((backup) => (
                <tr key={backup?.id} className="hover:bg-muted/30 transition-colors duration-base">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">{backup?.date}</div>
                    <div className="text-xs text-muted-foreground">{backup?.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{backup?.size}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        backup?.type === "Automatic" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                      }`}
                    >
                      {backup?.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{backup?.duration}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        backup?.status === "Completed" ? "bg-success/10 text-success" : "bg-error/10 text-error"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${backup?.status === "Completed" ? "bg-success" : "bg-error"}`} />
                      {backup?.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      {backup?.status === "Completed" && (
                        <>
                          <Button variant="ghost" size="icon" iconName="Download" />
                          <Button variant="ghost" size="icon" iconName="RotateCcw" />
                        </>
                      )}
                      <Button variant="ghost" size="icon" iconName="Trash2" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-error/10 border border-error/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="AlertCircle" size={20} className="text-error flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-medium text-sm text-foreground mb-1">Restore Warning</h5>
            <p className="text-xs text-muted-foreground mb-3">
              Restoring from a backup will replace all current data with the backup data. This action cannot be undone. Always create a manual backup before restoring.
            </p>
            <Button variant="outline" size="sm" iconName="RotateCcw">
              Restore from Backup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupRestore;
