import React from "react";
import { useTranslation } from "react-i18next";
import { getInitials, getAvatarColor, daysLeft, fmtDateTime } from "@/utils/adminUtilis/admin";

const ViewModal = ({ subscription, onClose }) => {
  const { t, i18n } = useTranslation();
  const currentLng = i18n.language;
  const p = subscription.user_profiles || {};
  const days = daysLeft(subscription.current_period_end);
  const isExpired = days <= 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-background border border-border rounded-xl p-6 w-full max-w-lg shadow-2xl space-y-5 mx-4 relative">
        <header className="pr-8">
          <h3 className="text-xl font-bold text-foreground">{t("admin.modals.view.title")}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("admin.modals.view.idLabel")}: {subscription.id || subscription.user_id}
          </p>
        </header>

        {/* User info */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("admin.modals.view.userDataSection")}
          </h4>
          <div className="flex items-center gap-3 bg-muted/30 p-3 rounded-lg border border-border">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold ${getAvatarColor(p.full_name || "U")}`}
            >
              {getInitials(p.full_name || "U")}
            </div>
            <div>
              <h5 className="font-semibold text-sm text-foreground">{p.full_name || t("admin.table.noName")}</h5>
              <p className="text-xs text-muted-foreground">{p.email}</p>
              <p className="text-[11px] font-mono text-primary mt-0.5">@{p.username}</p>
            </div>
          </div>
        </div>

        {/* Status info */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("admin.modals.view.statusSection")}
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/30 p-3 rounded-lg border border-border flex flex-col justify-between">
              <span className="text-[11px] text-muted-foreground">{t("admin.modals.view.currentStatus")}</span>
              <span
                className={`inline-flex items-center gap-1.5 mt-1 self-start px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  subscription.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    subscription.status === "active" ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
                {subscription.status === "active" ? t("admin.status.active") : t("admin.status.inactive")}
              </span>
            </div>
            <div className="bg-muted/30 p-3 rounded-lg border border-border">
              <span className="text-[11px] text-muted-foreground">{t("admin.modals.view.remainingDays")}</span>
              <p className={`text-base font-bold mt-1 ${isExpired ? "text-red-500" : "text-foreground"}`}>
                {isExpired ? t("admin.modals.view.expiredLabel") : t("admin.modals.view.daysCount", { count: days })}
              </p>
            </div>
          </div>

          <div className="bg-muted/30 p-3 rounded-lg border border-border space-y-2 text-xs">
            <div className="flex justify-between border-b border-border/50 pb-1.5">
              <span className="text-muted-foreground">{t("admin.modals.view.createdAt")}:</span>
              <span className="font-medium text-foreground">{fmtDateTime(subscription.created_at, currentLng)}</span>
            </div>
            <div className="flex justify-between pt-0.5">
              <span className="text-muted-foreground">{t("admin.modals.view.nextExpiration")}:</span>
              <span className={`font-semibold ${isExpired ? "text-red-500" : "text-foreground"}`}>
                {fmtDateTime(subscription.current_period_end, currentLng)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors border border-border"
          >
            {t("admin.modals.view.closeBtn")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
