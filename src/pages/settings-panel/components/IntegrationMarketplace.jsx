import React, { useState } from "react";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useTranslation } from "react-i18next";

const IntegrationMarketplace = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const integrations = [
    {
      id: 1,
      name: "QuickBooks Online",
      category: t("integrations.categories.accounting"),
      description: t("integrations.descriptions.quickbooks"),
      icon: "DollarSign",
      status: t("integrations.status.connected"),
      lastSync: t("integrations.lastSync.2hours"),
      features: [
        t("integrations.features.quickbooks.invoicing"),
        t("integrations.features.quickbooks.paymentTracking"),
        t("integrations.features.quickbooks.financialReports"),
      ],
    },
    {
      id: 2,
      name: "Mailchimp",
      category: t("integrations.categories.marketing"),
      description: t("integrations.descriptions.mailchimp"),
      icon: "Mail",
      status: t("integrations.status.available"),
      features: [
        t("integrations.features.mailchimp.emailCampaigns"),
        t("integrations.features.mailchimp.newsletters"),
        t("integrations.features.mailchimp.reminders"),
      ],
    },
    {
      id: 3,
      name: "Twilio SMS",
      category: t("integrations.categories.communication"),
      description: t("integrations.descriptions.twilio"),
      icon: "MessageSquare",
      status: t("integrations.status.connected"),
      lastSync: t("integrations.lastSync.30min"),
      features: [
        t("integrations.features.twilio.smsReminders"),
        t("integrations.features.twilio.twoWay"),
        t("integrations.features.twilio.bulk"),
      ],
    },
    {
      id: 4,
      name: "Google Calendar",
      category: t("integrations.categories.scheduling"),
      description: t("integrations.descriptions.googleCalendar"),
      icon: "Calendar",
      status: t("integrations.status.available"),
      features: [
        t("integrations.features.googleCalendar.calendarSync"),
        t("integrations.features.googleCalendar.appointmentBlocking"),
        t("integrations.features.googleCalendar.teamScheduling"),
      ],
    },
    {
      id: 5,
      name: "Stripe Payments",
      category: t("integrations.categories.payments"),
      description: t("integrations.descriptions.stripe"),
      icon: "CreditCard",
      status: t("integrations.status.connected"),
      lastSync: t("integrations.lastSync.1hour"),
      features: [
        t("integrations.features.stripe.onlinePayments"),
        t("integrations.features.stripe.paymentPlans"),
        t("integrations.features.stripe.refundManagement"),
      ],
    },
    {
      id: 6,
      name: "Dropbox",
      category: t("integrations.categories.storage"),
      description: t("integrations.descriptions.dropbox"),
      icon: "Cloud",
      status: t("integrations.status.available"),
      features: [
        t("integrations.features.dropbox.fileStorage"),
        t("integrations.features.dropbox.documentSharing"),
        t("integrations.features.dropbox.autoBackup"),
      ],
    },
  ];

  const categories = [
    { value: "all", label: t("integrations.allCategories"), count: integrations?.length },
    { value: "accounting", label: t("integrations.categories.accounting"), count: 1 },
    { value: "marketing", label: t("integrations.categories.marketing"), count: 1 },
    { value: "communication", label: t("integrations.categories.communication"), count: 1 },
    { value: "scheduling", label: t("integrations.categories.scheduling"), count: 1 },
    { value: "payments", label: t("integrations.categories.payments"), count: 1 },
    { value: "storage", label: t("integrations.categories.storage"), count: 1 },
  ];

  const filteredIntegrations = integrations?.filter((integration) => {
    const matchesSearch =
      integration?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      integration?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesCategory = selectedCategory === "all" || integration?.category?.toLowerCase() === selectedCategory?.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex-1 w-full lg:w-auto">
          <Input
            type="search"
            placeholder={t("integrations.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 w-full lg:w-auto">
          {categories?.map((category) => (
            <button
              key={category?.value}
              onClick={() => setSelectedCategory(category?.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-base ${
                selectedCategory === category?.value
                  ? "bg-primary text-primary-foreground shadow-clinical-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {category?.label} ({category?.count})
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations?.map((integration) => (
          <div
            key={integration?.id}
            className="bg-card border border-border rounded-lg p-4 hover:shadow-clinical-md transition-all duration-base"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={integration?.icon} size={24} color="var(--color-primary)" />
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  integration?.status === t("integrations.status.connected") ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${integration?.status === t("integrations.status.connected") ? "bg-success" : "bg-muted-foreground"}`}
                />
                {integration?.status}
              </span>
            </div>

            <h4 className="font-headline font-semibold text-base text-foreground mb-1">{integration?.name}</h4>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{integration?.description}</p>

            <div className="mb-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">{t("integrations.keyFeatures")}</p>
              <ul className="space-y-1">
                {integration?.features?.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-foreground">
                    <Icon name="Check" size={14} className="text-success flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {integration?.status === t("integrations.status.connected") && integration?.lastSync && (
              <div className="mb-3 pb-3 border-b border-border">
                <p className="text-xs text-muted-foreground">{t("integrations.lastSynced")} {integration?.lastSync}</p>
              </div>
            )}

            <div className="flex gap-2">
              {integration?.status === t("integrations.status.connected") ? (
                <>
                  <Button variant="outline" size="sm" className="flex-1" iconName="Settings">
                    {t("common.configure")}
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1" iconName="Unplug">
                    {t("integrations.disconnect")}
                  </Button>
                </>
              ) : (
                <Button variant="default" size="sm" className="w-full" iconName="Plus">
                  {t("integrations.connect")}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      {filteredIntegrations?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Package" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{t("integrations.noResults")}</p>
        </div>
      )}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Lightbulb" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-medium text-sm text-foreground mb-1">{t("integrations.customIntegration")}</h5>
            <p className="text-xs text-muted-foreground mb-3">
              {t("integrations.customIntegrationDesc")}
            </p>
            <Button variant="outline" size="sm" iconName="Mail">
              {t("integrations.contactSupport")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationMarketplace;
