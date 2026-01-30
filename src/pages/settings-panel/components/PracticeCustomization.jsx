import React, { useState } from "react";

import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";

const PracticeCustomization = () => {
  const [practiceName, setPracticeName] = useState("DentalCare Clinic");
  const [timezone, setTimezone] = useState("america-new-york");
  const [dateFormat, setDateFormat] = useState("mm-dd-yyyy");
  const [appointmentDuration, setAppointmentDuration] = useState("30");

  const timezoneOptions = [
    { value: "america-new-york", label: "Eastern Time (ET)" },
    { value: "america-chicago", label: "Central Time (CT)" },
    { value: "america-denver", label: "Mountain Time (MT)" },
    { value: "america-los-angeles", label: "Pacific Time (PT)" },
  ];

  const dateFormatOptions = [
    { value: "mm-dd-yyyy", label: "MM/DD/YYYY" },
    { value: "dd-mm-yyyy", label: "DD/MM/YYYY" },
    { value: "yyyy-mm-dd", label: "YYYY-MM-DD" },
  ];

  const durationOptions = [
    { value: "15", label: "15 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "45", label: "45 minutes" },
    { value: "60", label: "60 minutes" },
  ];

  const workflowSettings = [
    { id: "auto-save", label: "Auto-save clinical notes", description: "Automatically save notes every 2 minutes", checked: true },
    {
      id: "appointment-reminders",
      label: "Send appointment reminders",
      description: "Email and SMS reminders 24 hours before",
      checked: true,
    },
    {
      id: "treatment-alerts",
      label: "Treatment completion alerts",
      description: "Notify when treatment plans are completed",
      checked: true,
    },
    { id: "billing-notifications", label: "Billing notifications", description: "Alert for pending payments and invoices", checked: false },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Input
          label="Practice Name"
          type="text"
          value={practiceName}
          onChange={(e) => setPracticeName(e?.target?.value)}
          description="This name appears on reports and communications"
        />
        <Input label="Practice Phone" type="tel" placeholder="(555) 123-4567" description="Main contact number for the practice" />
        <Input
          label="Practice Email"
          type="email"
          placeholder="contact@dentalcare.com"
          description="Primary email for practice communications"
        />
        <Input
          label="Practice Address"
          type="text"
          placeholder="123 Main Street, City, State"
          description="Physical location of the practice"
        />
      </div>
      <div className="border-t border-border pt-6">
        <h4 className="font-headline font-semibold text-base text-foreground mb-4">Regional Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Timezone"
            options={timezoneOptions}
            value={timezone}
            onChange={setTimezone}
            description="Practice operating timezone"
          />
          <Select
            label="Date Format"
            options={dateFormatOptions}
            value={dateFormat}
            onChange={setDateFormat}
            description="How dates are displayed"
          />
          <Select
            label="Default Appointment Duration"
            options={durationOptions}
            value={appointmentDuration}
            onChange={setAppointmentDuration}
            description="Standard appointment length"
          />
        </div>
      </div>
      <div className="border-t border-border pt-6">
        <h4 className="font-headline font-semibold text-base text-foreground mb-4">Workflow Automation</h4>
        <div className="space-y-4">
          {workflowSettings?.map((setting) => (
            <div key={setting?.id} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
              <Checkbox checked={setting?.checked} onChange={() => {}} className="mt-0.5" />
              <div className="flex-1">
                <label className="font-medium text-sm text-foreground cursor-pointer">{setting?.label}</label>
                <p className="text-xs text-muted-foreground mt-0.5">{setting?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-border pt-6">
        <h4 className="font-headline font-semibold text-base text-foreground mb-4">Treatment Protocols</h4>
        <div className="bg-muted/30 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm text-foreground">Custom Treatment Templates</p>
              <p className="text-xs text-muted-foreground">Create and manage treatment plan templates</p>
            </div>
            <Button variant="outline" size="sm" iconName="Plus">
              Add Template
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm text-foreground">Clinical Guidelines</p>
              <p className="text-xs text-muted-foreground">Upload practice-specific clinical protocols</p>
            </div>
            <Button variant="outline" size="sm" iconName="Upload">
              Upload
            </Button>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button variant="default" iconName="Save">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default PracticeCustomization;
