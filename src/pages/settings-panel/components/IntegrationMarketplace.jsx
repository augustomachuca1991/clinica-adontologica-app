import React, { useState } from "react";
import Icon from "../../../components/AppIcon";

import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

const IntegrationMarketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const integrations = [
    {
      id: 1,
      name: "QuickBooks Online",
      category: "Accounting",
      description: "Sync billing and financial data with QuickBooks for seamless accounting",
      icon: "DollarSign",
      status: "Connected",
      lastSync: "2 hours ago",
      features: ["Automated invoicing", "Payment tracking", "Financial reports"],
    },
    {
      id: 2,
      name: "Mailchimp",
      category: "Marketing",
      description: "Send appointment reminders and marketing campaigns to patients",
      icon: "Mail",
      status: "Available",
      features: ["Email campaigns", "Patient newsletters", "Automated reminders"],
    },
    {
      id: 3,
      name: "Twilio SMS",
      category: "Communication",
      description: "Send SMS notifications and appointment reminders to patients",
      icon: "MessageSquare",
      status: "Connected",
      lastSync: "30 minutes ago",
      features: ["SMS reminders", "Two-way messaging", "Bulk notifications"],
    },
    {
      id: 4,
      name: "Google Calendar",
      category: "Scheduling",
      description: "Sync appointments with Google Calendar for better scheduling",
      icon: "Calendar",
      status: "Available",
      features: ["Calendar sync", "Appointment blocking", "Team scheduling"],
    },
    {
      id: 5,
      name: "Stripe Payments",
      category: "Payments",
      description: "Accept credit card payments and manage transactions securely",
      icon: "CreditCard",
      status: "Connected",
      lastSync: "1 hour ago",
      features: ["Online payments", "Payment plans", "Refund management"],
    },
    {
      id: 6,
      name: "Dropbox",
      category: "Storage",
      description: "Store and share patient documents and clinical images securely",
      icon: "Cloud",
      status: "Available",
      features: ["File storage", "Document sharing", "Automatic backup"],
    },
  ];

  const categories = [
    { value: "all", label: "All Categories", count: integrations?.length },
    { value: "accounting", label: "Accounting", count: 1 },
    { value: "marketing", label: "Marketing", count: 1 },
    { value: "communication", label: "Communication", count: 1 },
    { value: "scheduling", label: "Scheduling", count: 1 },
    { value: "payments", label: "Payments", count: 1 },
    { value: "storage", label: "Storage", count: 1 },
  ];

  const filteredIntegrations = integrations?.filter((integration) => {
    const matchesSearch = integration?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) || integration?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesCategory = selectedCategory === "all" || integration?.category?.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex-1 w-full lg:w-auto">
          <Input type="search" placeholder="Search integrations..." value={searchQuery} onChange={(e) => setSearchQuery(e?.target?.value)} className="w-full" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 w-full lg:w-auto">
          {categories?.map((category) => (
            <button
              key={category?.value}
              onClick={() => setSelectedCategory(category?.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-base ${
                selectedCategory === category?.value ? "bg-primary text-primary-foreground shadow-clinical-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {category?.label} ({category?.count})
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations?.map((integration) => (
          <div key={integration?.id} className="bg-card border border-border rounded-lg p-4 hover:shadow-clinical-md transition-all duration-base">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={integration?.icon} size={24} color="var(--color-primary)" />
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  integration?.status === "Connected" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${integration?.status === "Connected" ? "bg-success" : "bg-muted-foreground"}`} />
                {integration?.status}
              </span>
            </div>

            <h4 className="font-headline font-semibold text-base text-foreground mb-1">{integration?.name}</h4>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{integration?.description}</p>

            <div className="mb-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">Key Features:</p>
              <ul className="space-y-1">
                {integration?.features?.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-foreground">
                    <Icon name="Check" size={14} className="text-success flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {integration?.status === "Connected" && integration?.lastSync && (
              <div className="mb-3 pb-3 border-b border-border">
                <p className="text-xs text-muted-foreground">Last synced: {integration?.lastSync}</p>
              </div>
            )}

            <div className="flex gap-2">
              {integration?.status === "Connected" ? (
                <>
                  <Button variant="outline" size="sm" className="flex-1" iconName="Settings">
                    Configure
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1" iconName="Unplug">
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button variant="default" size="sm" className="w-full" iconName="Plus">
                  Connect
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      {filteredIntegrations?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Package" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No integrations found matching your criteria</p>
        </div>
      )}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Lightbulb" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-medium text-sm text-foreground mb-1">Need a Custom Integration?</h5>
            <p className="text-xs text-muted-foreground mb-3">
              Contact our support team to discuss custom integration options for your practice. We can help connect DentalCare Manager with your existing tools and workflows.
            </p>
            <Button variant="outline" size="sm" iconName="Mail">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationMarketplace;
