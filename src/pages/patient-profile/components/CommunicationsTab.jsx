import React, { useState } from "react";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

const CommunicationsTab = ({ communications }) => {
  const [messageType, setMessageType] = useState("email");
  const [messageSubject, setMessageSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");

  const messageTypeOptions = [
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS" },
    { value: "phone", label: "Phone Call" },
  ];

  const getMessageIcon = (type) => {
    switch (type) {
      case "Email":
        return "Mail";
      case "SMS":
        return "MessageSquare";
      case "Phone":
        return "Phone";
      case "Appointment":
        return "Calendar";
      default:
        return "MessageCircle";
    }
  };

  const getMessageColor = (type) => {
    switch (type) {
      case "Email":
        return "bg-primary/10 text-primary";
      case "SMS":
        return "bg-secondary/10 text-secondary";
      case "Phone":
        return "bg-warning/10 text-warning";
      case "Appointment":
        return "bg-success/10 text-success";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleSendMessage = () => {
    console.log("Sending message:", { messageType, messageSubject, messageContent });
    setMessageSubject("");
    setMessageContent("");
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-card rounded-lg border border-border p-4 md:p-6 clinical-card">
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Send" size={20} color="var(--color-primary)" />
          </div>
          <h3 className="text-lg md:text-xl font-headline font-semibold text-foreground">Send New Message</h3>
        </div>

        <div className="space-y-4">
          <Select label="Message Type" options={messageTypeOptions} value={messageType} onChange={setMessageType} />

          <Input
            label="Subject"
            type="text"
            placeholder="Enter message subject"
            value={messageSubject}
            onChange={(e) => setMessageSubject(e?.target?.value)}
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Message Content</label>
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e?.target?.value)}
              placeholder="Type your message here..."
              rows={4}
              className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-base resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="default" iconName="Send" iconPosition="left" onClick={handleSendMessage} className="flex-1 sm:flex-none">
              Send Message
            </Button>
            <Button variant="outline" iconName="Calendar" iconPosition="left" className="flex-1 sm:flex-none">
              Schedule Reminder
            </Button>
          </div>
        </div>
      </div>
      <div className="bg-card rounded-lg border border-border p-4 md:p-6 clinical-card">
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="MessageCircle" size={20} color="var(--color-secondary)" />
          </div>
          <h3 className="text-lg md:text-xl font-headline font-semibold text-foreground">Communication History</h3>
        </div>

        <div className="space-y-3 md:space-y-4">
          {communications?.map((comm, index) => (
            <div
              key={index}
              className="p-3 md:p-4 bg-muted/50 rounded-lg border border-border hover:bg-muted transition-colors duration-base"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getMessageColor(comm?.type)}`}>
                    <Icon name={getMessageIcon(comm?.type)} size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm md:text-base font-medium text-foreground">{comm?.subject}</p>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getMessageColor(comm?.type)}`}>{comm?.type}</span>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {comm?.sender} •{" "}
                      {new Date(comm.date)?.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                {comm?.status && (
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
                      comm?.status === "Sent"
                        ? "bg-success/10 text-success"
                        : comm?.status === "Delivered"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {comm?.status}
                  </span>
                )}
              </div>
              <p className="text-sm text-foreground pl-0 sm:pl-13">{comm?.content}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-card rounded-lg border border-border p-4 md:p-6 clinical-card">
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-warning/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Bell" size={20} color="var(--color-warning)" />
          </div>
          <h3 className="text-lg md:text-xl font-headline font-semibold text-foreground">Upcoming Reminders</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <Icon name="Calendar" size={18} className="text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm md:text-base font-medium text-foreground">6-Month Checkup Reminder</p>
              <p className="text-xs md:text-sm text-muted-foreground">Scheduled for: March 15, 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-warning/5 rounded-lg border border-warning/20">
            <Icon name="Clock" size={18} className="text-warning flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm md:text-base font-medium text-foreground">Treatment Follow-up</p>
              <p className="text-xs md:text-sm text-muted-foreground">Scheduled for: February 1, 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationsTab;
