import React from "react";
import { useTranslation } from "react-i18next";

const RenewModal = ({ subscription, renewalDate, onDateChange, onConfirm, onCancel, isRenewing }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-background border border-border rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4 mx-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">{t("admin.modals.renew.title")}</h3>
          <p className="text-sm text-muted-foreground mt-1">{t("admin.modals.renew.description")}</p>
        </div>

        <div className="bg-muted/40 p-3 rounded-lg text-xs space-y-1 text-muted-foreground">
          <p>
            <strong className="text-foreground">{t("admin.modals.shared.user")}:</strong>{" "}
            {subscription.user_profiles?.full_name}
          </p>
          <p>
            <strong className="text-foreground">{t("common.labels.email")}:</strong>{" "}
            {subscription.user_profiles?.email}
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">{t("admin.modals.renew.startDate")}</label>
          <input
            type="date"
            value={renewalDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full p-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isRenewing}
            className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
          >
            {t("common.actions.cancel")}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isRenewing}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            {isRenewing ? t("admin.form.processing") : t("admin.modals.renew.confirmBtn")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenewModal;
