import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import { Checkbox } from "../../../components/ui/Checkbox";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";

const NotificationPreferences = () => {
  const [emailFrequency, setEmailFrequency] = useState("daily");

  const frequencyOptions = [
    { value: "realtime", label: "Real-time" },
    { value: "hourly", label: "Hourly digest" },
    { value: "daily", label: "Daily digest" },
    { value: "weekly", label: "Weekly digest" },
  ];

  const notificationCategories = [
    {
      category: "Appointments",
      icon: "Calendar",
      notifications: [
        { id: "appointment-created", label: "New appointment scheduled", email: true, push: true, sms: false },
        { id: "appointment-cancelled", label: "Appointment cancelled", email: true, push: true, sms: true },
        { id: "appointment-reminder", label: "Upcoming appointment reminder", email: true, push: true, sms: true },
        { id: "appointment-confirmed", label: "Patient confirmed appointment", email: true, push: false, sms: false },
      ],
    },
    {
      category: "Patient Records",
      icon: "FileText",
      notifications: [
        { id: "record-updated", label: "Patient record updated", email: true, push: true, sms: false },
        { id: "lab-results", label: "Lab results available", email: true, push: true, sms: false },
        { id: "treatment-completed", label: "Treatment plan completed", email: true, push: false, sms: false },
        { id: "document-uploaded", label: "New document uploaded", email: false, push: true, sms: false },
      ],
    },
    {
      category: "Billing & Payments",
      icon: "DollarSign",
      notifications: [
        { id: "payment-received", label: "Payment received", email: true, push: true, sms: false },
        { id: "invoice-sent", label: "Invoice sent to patient", email: true, push: false, sms: false },
        { id: "payment-overdue", label: "Payment overdue", email: true, push: true, sms: true },
        { id: "payment-plan-updated", label: "Payment plan updated", email: true, push: false, sms: false },
      ],
    },
    {
      category: "System & Security",
      icon: "Shield",
      notifications: [
        { id: "login-new-device", label: "Login from new device", email: true, push: true, sms: true },
        { id: "password-changed", label: "Password changed", email: true, push: true, sms: true },
        { id: "system-maintenance", label: "System maintenance scheduled", email: true, push: true, sms: false },
        { id: "backup-completed", label: "Backup completed", email: false, push: false, sms: false },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-muted/30 border border-border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Bell" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-sm text-foreground mb-1">Notification Delivery</h4>
            <p className="text-xs text-muted-foreground mb-4">Choose how you want to receive notifications. You can customize preferences for each notification type below.</p>
            <Select
              label="Email Notification Frequency"
              options={frequencyOptions}
              value={emailFrequency}
              onChange={setEmailFrequency}
              description="How often you receive email notifications"
              className="max-w-xs"
            />
          </div>
        </div>
      </div>
      <div className="space-y-6">
        {notificationCategories?.map((category) => (
          <div key={category?.category} className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-muted/30 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={category?.icon} size={16} color="var(--color-primary)" />
                </div>
                <h4 className="font-headline font-semibold text-base text-foreground">{category?.category}</h4>
              </div>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Notification Type</th>
                      <th className="pb-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider w-24">Email</th>
                      <th className="pb-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider w-24">Push</th>
                      <th className="pb-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider w-24">SMS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {category?.notifications?.map((notification) => (
                      <tr key={notification?.id} className="hover:bg-muted/30 transition-colors duration-base">
                        <td className="py-3 text-sm text-foreground">{notification?.label}</td>
                        <td className="py-3 text-center">
                          <div className="flex justify-center">
                            <Checkbox checked={notification?.email} onChange={() => {}} />
                          </div>
                        </td>
                        <td className="py-3 text-center">
                          <div className="flex justify-center">
                            <Checkbox checked={notification?.push} onChange={() => {}} />
                          </div>
                        </td>
                        <td className="py-3 text-center">
                          <div className="flex justify-center">
                            <Checkbox checked={notification?.sms} onChange={() => {}} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="AlertTriangle" size={20} className="text-warning flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-medium text-sm text-foreground mb-1">Important Notice</h5>
            <p className="text-xs text-muted-foreground">
              Critical security notifications (login from new device, password changes) cannot be disabled to ensure account security. SMS notifications may incur additional charges from your carrier.
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button variant="default" iconName="Save">
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default NotificationPreferences;
