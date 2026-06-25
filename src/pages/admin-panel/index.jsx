import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSubscription, getSubscriptionStats } from "@/hooks/SubscriptionHooks";
import { useUserRegistration } from "@/hooks/UserHooks";
import { notifyError, notifySuccess } from "@/utils/notifications";

import SubscriptionTable from "@/pages/admin-panel/components/SubscriptionTable";
import CreateSubscriptionForm from "@/pages/admin-panel/components/CreateSubscriptionForm";
import RenewModal from "@/pages/admin-panel/components/RenewModal";
import ViewModal from "@/pages/admin-panel/components/ViewModal";

const statCard = (icon, label, value, sub, accentClass) => (
  <div className="bg-card border border-border rounded-xl p-4 flex items-start gap-3 transition-shadow hover:shadow-sm">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${accentClass}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold mt-0.5 text-foreground">{value}</p>
      {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  </div>
);

const AdminPanel = () => {
  const { t } = useTranslation();

  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [viewingSub, setViewingSub] = useState(null);
  const [renewalDate, setRenewalDate] = useState(new Date().toISOString().split("T")[0]);
  const [isRenewing, setIsRenewing] = useState(false);

  const { subscriptions, loading, error, renewSubscription, createSubscription, refresh } = useSubscription();
  const { users, fetchUsers } = useUserRegistration();

  const stats = useMemo(() => getSubscriptionStats(subscriptions), [subscriptions]);

  const handleConfirmRenewal = async () => {
    if (!selectedSub) return;
    setIsRenewing(true);
    const result = await renewSubscription(selectedSub.id, renewalDate);
    setIsRenewing(false);

    if (result.success) {
      notifySuccess(t("admin.alerts.renewSuccess"));
      setSelectedSub(null);
    } else {
      notifyError(t("admin.alerts.renewError") + result.error);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 fade-in-up">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{t("admin.header.title")}</h1>
        <p className="text-muted-foreground text-sm mt-0.5">{t("admin.header.subtitle")}</p>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCard(
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" />
          </svg>,
          t("admin.stats.total"),
          stats.total,
          null,
          "bg-blue-50"
        )}
        {statCard(
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" />
          </svg>,
          t("admin.stats.expiring"),
          stats.active,
          t("admin.stats.thisMonth", { count: stats.expiringSoon }),
          "bg-emerald-50"
        )}
        {statCard(
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" />
          </svg>,
          t("admin.stats.expired"),
          stats.expired,
          t("admin.stats.notRenewed"),
          "bg-red-50"
        )}
        {statCard(
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><path d="M12 9v4" /><path d="M12 17h.01" />
          </svg>,
          t("admin.stats.attention"),
          stats.expiringSoon + stats.expired,
          null,
          "bg-amber-50"
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section className="lg:col-span-8">
          <SubscriptionTable
            subscriptions={subscriptions}
            loading={loading}
            error={error}
            openMenuId={openMenuId}
            setOpenMenuId={setOpenMenuId}
            onView={(sub) => {
              setViewingSub(sub);
              setOpenMenuId(null);
            }}
            onRenew={(sub) => {
              setSelectedSub(sub);
              setOpenMenuId(null);
            }}
          />
        </section>

        <aside className="lg:col-span-4 sticky top-6">
          <CreateSubscriptionForm users={users} onSubmit={createSubscription} />
        </aside>
      </div>

      {selectedSub && (
        <RenewModal
          subscription={selectedSub}
          renewalDate={renewalDate}
          onDateChange={setRenewalDate}
          onConfirm={handleConfirmRenewal}
          onCancel={() => setSelectedSub(null)}
          isRenewing={isRenewing}
        />
      )}

      {viewingSub && <ViewModal subscription={viewingSub} onClose={() => setViewingSub(null)} />}
    </div>
  );
};

export default AdminPanel;