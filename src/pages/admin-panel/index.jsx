import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSubscription } from "@/hooks/SubscriptionHooks";
import { useUserRegistration } from "@/hooks/UserHooks";
import { notifyError, notifySuccess } from "@/utils/notifications";

import SubscriptionTable from "@/pages/admin-panel/components/SubscriptionTable";
import CreateSubscriptionForm from "@/pages/admin-panel/components/CreateSubscriptionForm";
import RenewModal from "@/pages/admin-panel/components/RenewModal";
import ViewModal from "@/pages/admin-panel/components/ViewModal";

const AdminPanel = () => {
  const { t } = useTranslation();

  // ── Table state ──────────────────────────────────────────────────
  const [openMenuId, setOpenMenuId] = useState(null);

  // ── Modal state ──────────────────────────────────────────────────
  const [selectedSub, setSelectedSub] = useState(null); // renew modal
  const [viewingSub, setViewingSub] = useState(null); // view modal
  const [renewalDate, setRenewalDate] = useState(new Date().toISOString().split("T")[0]);
  const [isRenewing, setIsRenewing] = useState(false);

  // ── Data hooks ───────────────────────────────────────────────────
  const { subscriptions, loading, error, renewSubscription, createSubscription, refresh } = useSubscription();
  const { users, fetchUsers } = useUserRegistration();

  // ── Handlers ─────────────────────────────────────────────────────
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
    <div className="p-6 max-w-7xl mx-auto space-y-8 fade-in-up">
      {/* ── Header ── */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("admin.header.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("admin.header.subtitle")}</p>
      </header>

      {/* ── Main layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Table */}
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

        {/* Form */}
        <aside className="lg:col-span-4 sticky top-6">
          <CreateSubscriptionForm users={users} onSubmit={createSubscription} />
        </aside>
      </div>

      {/* ── Renew modal ── */}
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

      {/* ── View modal ── */}
      {viewingSub && <ViewModal subscription={viewingSub} onClose={() => setViewingSub(null)} />}
    </div>
  );
};

export default AdminPanel;
