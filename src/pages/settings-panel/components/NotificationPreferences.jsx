import React, { useState } from "react";
import Icon from "@/components/AppIcon";
import { Checkbox } from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { useTranslation } from "react-i18next";

const NotificationPreferences = () => {
  const { t } = useTranslation();
  const [emailFrequency, setEmailFrequency] = useState("daily");

  const frequencyOptions = [
    { value: "realtime", label: t("notifications.frequencies.realtime") },
    { value: "hourly", label: t("notifications.frequencies.hourly") },
    { value: "daily", label: t("notifications.frequencies.daily") },
    { value: "weekly", label: t("notifications.frequencies.weekly") },
  ];

  const notificationCategories = [
    {
      category: t("notifications.categories.appointments"),
      icon: "Calendar",
      notifications: [
        {
          id: "appointment-created",
          label: t("notifications.labels.appointment_created"),
          email: true,
          push: true,
          sms: false,
        },
        {
          id: "appointment-cancelled",
          label: t("notifications.labels.appointment_cancelled"),
          email: true,
          push: true,
          sms: true,
        },
        {
          id: "appointment-reminder",
          label: t("notifications.labels.appointment_reminder"),
          email: true,
          push: true,
          sms: true,
        },
        {
          id: "appointment-confirmed",
          label: t("notifications.labels.appointment_confirmed"),
          email: true,
          push: false,
          sms: false,
        },
      ],
    },
    {
      category: t("notifications.categories.patient_records"),
      icon: "FileText",
      notifications: [
        { id: "record-updated", label: t("notifications.labels.record_updated"), email: true, push: true, sms: false },
        { id: "lab-results", label: t("notifications.labels.lab_results"), email: true, push: true, sms: false },
        {
          id: "treatment-completed",
          label: t("notifications.labels.treatment_completed"),
          email: true,
          push: false,
          sms: false,
        },
        {
          id: "document-uploaded",
          label: t("notifications.labels.document_uploaded"),
          email: false,
          push: true,
          sms: false,
        },
      ],
    },
    {
      category: t("notifications.categories.billing_payments"),
      icon: "DollarSign",
      notifications: [
        {
          id: "payment-received",
          label: t("notifications.labels.payment_received"),
          email: true,
          push: true,
          sms: false,
        },
        { id: "invoice-sent", label: t("notifications.labels.invoice_sent"), email: true, push: false, sms: false },
        { id: "payment-overdue", label: t("notifications.labels.payment_overdue"), email: true, push: true, sms: true },
        {
          id: "payment-plan-updated",
          label: t("notifications.labels.payment_plan_updated"),
          email: true,
          push: false,
          sms: false,
        },
      ],
    },
    {
      category: t("notifications.categories.system_security"),
      icon: "Shield",
      notifications: [
        {
          id: "login-new-device",
          label: t("notifications.labels.login_new_device"),
          email: true,
          push: true,
          sms: true,
        },
        {
          id: "password-changed",
          label: t("notifications.labels.password_changed"),
          email: true,
          push: true,
          sms: true,
        },
        {
          id: "system-maintenance",
          label: t("notifications.labels.system_maintenance"),
          email: true,
          push: true,
          sms: false,
        },
        {
          id: "backup-completed",
          label: t("notifications.labels.backup_completed"),
          email: false,
          push: false,
          sms: false,
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-muted/30 border border-border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Bell" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-sm text-foreground mb-1">{t("notifications.delivery_title")}</h4>
            <p className="text-xs text-muted-foreground mb-4">{t("notifications.delivery_description")}</p>
            <Select
              label={t("notifications.frequency_label")}
              options={frequencyOptions}
              value={emailFrequency}
              onChange={setEmailFrequency}
              description={t("notifications.frequency_description")}
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
                      <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t("notifications.table.type")}
                      </th>
                      <th className="pb-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider w-24">
                        {t("notifications.table.email")}
                      </th>
                      <th className="pb-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider w-24">
                        {t("notifications.table.push")}
                      </th>
                      <th className="pb-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider w-24">
                        {t("notifications.table.sms")}
                      </th>
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
            <h5 className="font-medium text-sm text-foreground mb-1">{t("notifications.notice.title")}</h5>
            <p className="text-xs text-muted-foreground">{t("notifications.notice.description")}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline">{t("notifications.buttons.reset")}</Button>
        <Button variant="default" iconName="Save">
          {t("notifications.buttons.save")}
        </Button>
      </div>
    </div>
  );
};

export default NotificationPreferences;
