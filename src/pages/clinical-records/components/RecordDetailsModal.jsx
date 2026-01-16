import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";

const RecordDetailsModal = ({ record, onClose }) => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: "FileText" },
    { id: "notes", label: "Clinical Notes", icon: "MessageSquare" },
    { id: "images", label: "Images", icon: "Image" },
    { id: "history", label: "History", icon: "Clock" },
  ];

  const getStatusColor = (status) => {
    const colors = {
      completed: "bg-success/10 text-success border-success/20",
      "in-progress": "bg-warning/10 text-warning border-warning/20",
      planned: "bg-primary/10 text-primary border-primary/20",
      cancelled: "bg-muted text-muted-foreground border-border",
    };
    return colors?.[status] || colors?.planned;
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-clinical-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-lg md:text-xl font-headline font-semibold text-foreground">{record?.treatmentName}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {record?.patientName} • ID: {record?.patientId}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} iconName="X" aria-label="Close modal" />
        </div>

        <div className="border-b border-border overflow-x-auto flex-shrink-0">
          <div className="flex gap-1 px-6">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-base whitespace-nowrap ${
                  activeTab === tab?.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</label>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border mt-2 ${getStatusColor(record?.status)}`}>
                      <Icon name="Circle" size={8} className="fill-current" />
                      {record?.status?.charAt(0)?.toUpperCase() + record?.status?.slice(1)?.replace("-", " ")}
                    </span>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Treatment Date</label>
                    <p className="text-sm text-foreground mt-1">{record?.date}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Provider</label>
                    <p className="text-sm text-foreground mt-1">{record?.provider}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tooth Number</label>
                    <p className="text-sm text-foreground mt-1">{record?.toothNumber}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Treatment Type</label>
                    <p className="text-sm text-foreground mt-1 capitalize">{record?.treatmentType?.replace("-", " ")}</p>
                  </div>
                  {record?.cost && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Cost</label>
                      <p className="text-sm text-foreground mt-1">${record?.cost?.toLocaleString()}</p>
                    </div>
                  )}
                  {record?.duration && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Duration</label>
                      <p className="text-sm text-foreground mt-1">{record?.duration}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">Treatment Notes</label>
                <div className="bg-muted border border-border rounded-lg p-4">
                  <p className="text-sm text-foreground leading-relaxed">{record?.notes}</p>
                </div>
              </div>

              {record?.followUp && (
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Icon name="Calendar" size={20} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-warning mb-1">Follow-up Required</h4>
                      <p className="text-sm text-foreground">{record?.followUp}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "notes" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-headline font-semibold text-foreground">Clinical Notes</h4>
                <Button variant="outline" size="sm" iconName="Plus" iconPosition="left">
                  Add Note
                </Button>
              </div>
              {[1, 2, 3]?.map((note) => (
                <div key={note} className="bg-muted border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon name="User" size={14} color="var(--color-primary)" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Dr. Sarah Johnson</p>
                        <p className="text-xs text-muted-foreground">
                          January {15 - note}, 2026 • 10:{30 + note * 15} AM
                        </p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">Progress Note</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    Patient showing excellent progress. Treatment area healing well with no signs of complications. Continue current care regimen and schedule follow-up in 2 weeks.
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "images" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-headline font-semibold text-foreground">Clinical Images</h4>
                <Button variant="outline" size="sm" iconName="Upload" iconPosition="left">
                  Upload Image
                </Button>
              </div>
              {record?.attachments && record?.attachments?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {record?.attachments?.map((attachment, index) => (
                    <div key={index} className="relative group overflow-hidden rounded-lg border border-border">
                      <div className="aspect-[4/3]">
                        <Image src={attachment?.url} alt={attachment?.alt} className="w-full h-full object-cover transition-transform duration-base group-hover:scale-105" />
                      </div>
                      <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-base flex items-center justify-center gap-2">
                        <Button variant="secondary" size="sm" iconName="Eye" />
                        <Button variant="secondary" size="sm" iconName="Download" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted rounded-lg border border-border">
                  <Icon name="Image" size={48} className="mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No clinical images available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-4">
              <h4 className="text-base font-headline font-semibold text-foreground mb-4">Treatment History</h4>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                {[1, 2, 3, 4]?.map((item) => (
                  <div key={item} className="relative pl-12 pb-6">
                    <div className="absolute left-2.5 top-2 w-3 h-3 rounded-full bg-primary border-2 border-card" />
                    <div className="bg-muted border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-foreground">Status Updated</p>
                        <p className="text-xs text-muted-foreground">January {20 - item}, 2026</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Treatment status changed to {item === 1 ? "Completed" : item === 2 ? "In Progress" : "Planned"} by Dr. Sarah Johnson</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-card border-t border-border px-6 py-4 flex items-center justify-end gap-3 flex-shrink-0">
          <Button variant="outline" iconName="Download" iconPosition="left">
            Export PDF
          </Button>
          <Button variant="outline" iconName="Printer" iconPosition="left">
            Print
          </Button>
          <Button variant="default" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecordDetailsModal;
