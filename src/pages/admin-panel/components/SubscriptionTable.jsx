import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { getInitials, getAvatarColor, fmtDate, getSubscriptionStatus } from "@/utils/adminUtils/admin";

const ActionMenu = ({ subscriptionId, openMenuId, onToggle, onView, onRenew, showRenew, t }) => {
  const menuRef = useRef(null);

  // Cierra el menú al hacer click fuera
  useEffect(() => {
    if (openMenuId !== subscriptionId) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onToggle(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openMenuId, subscriptionId, onToggle]);

  const isOpen = openMenuId === subscriptionId;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => onToggle(isOpen ? null : subscriptionId)}
        className="p-2 hover:bg-muted rounded-full transition-all hover:scale-110 text-muted-foreground font-bold tracking-widest"
        aria-label="Acciones"
      >
        •••
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 bg-background border border-border rounded-lg shadow-lg z-10 min-w-[160px]">
          <button
            onClick={onView}
            className="w-full text-left px-4 py-2 hover:bg-muted text-sm transition-colors flex items-center gap-2 text-foreground"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {t("admin.actions.viewInfo")}
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-muted text-sm transition-colors flex items-center gap-2 text-foreground border-t border-border">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
            </svg>
            {t("admin.actions.modify")}
          </button>
          {showRenew && (
            <button
              onClick={onRenew}
              className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-sm text-emerald-700 transition-colors flex items-center gap-2 border-t border-border"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 2v6h-6" />
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                <path d="M3 22v-6h6" />
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
              </svg>
              {t("admin.actions.renew")}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const SubscriptionTable = ({ subscriptions, loading, error, openMenuId, setOpenMenuId, onView, onRenew }) => {
  const { t, i18n } = useTranslation();
  const currentLng = i18n.language;

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin">⚙️</div>
        <p className="text-muted-foreground mt-2">{t("admin.table.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">{t("admin.table.error", { error })}</p>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">{t("admin.table.empty")}</p>
      </div>
    );
  }

  return (
    <div className="clinical-card overflow-visible">
      {/* ── Desktop header (oculto en mobile) ── */}
      <div className="hidden sm:grid sm:grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-3 bg-muted/50 border-b border-border rounded-t-xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("admin.table.thUser")}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground w-28">
          {t("common.labels.status")}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground w-32">
          {t("admin.table.thExpiration")}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground w-10">
          {t("admin.table.thActions")}
        </span>
      </div>

      {/* ── Rows ── */}
      <div className="divide-y divide-border">
        {subscriptions.map((subscription) => {
          const p = subscription.user_profiles || {};
          const estado = getSubscriptionStatus(subscription, t);
          const canRenew = estado.key === "expired" || estado.key === "grace";
          const dateColorClass =
            estado.key === "expired" ? "text-red-600" : estado.key === "grace" ? "text-amber-600" : "text-foreground";

          return (
            <div key={subscription.id} className="hover:bg-muted/20 transition-colors px-4 py-3">
              {/*
                Layout:
                  mobile  → columna: [avatar + info] luego [estado | fecha | menu]
                  desktop → fila: [avatar+info flex-1] [estado w-28] [fecha w-32] [menu w-10]
              */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                {/* Usuario */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${getAvatarColor(p.full_name)}`}
                  >
                    {getInitials(p.full_name)}
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-medium text-sm text-foreground truncate">
                      {p.full_name || t("admin.table.noName")}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">{p.email || "-"}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">@{p.username || "sin-user"}</span>
                  </div>
                </div>

                {/* Estado + Fecha + Menú — en mobile: fila inline debajo del usuario */}
                <div className="flex items-center gap-3 sm:contents pl-12 sm:pl-0">
                  {/* Estado */}
                  <div className="sm:w-28 flex-shrink-0">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${estado.claseBg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${estado.claseCirculo}`} />
                      {estado.texto}
                    </span>
                  </div>

                  {/* Fecha */}
                  <div className="sm:w-32 flex-shrink-0">
                    <div className={`text-sm font-medium ${dateColorClass}`}>
                      {fmtDate(subscription.current_period_end, currentLng)}
                    </div>
                    <div className={`text-[10px] mt-0.5 ${estado.claseTextoDias}`}>{estado.textoDias}</div>
                  </div>

                  {/* Menú acciones */}
                  <div className="sm:w-10 flex-shrink-0 ml-auto sm:ml-0">
                    <ActionMenu
                      subscriptionId={subscription.id}
                      openMenuId={openMenuId}
                      onToggle={setOpenMenuId}
                      onView={() => onView(subscription)}
                      onRenew={() => onRenew(subscription)}
                      showRenew={canRenew}
                      t={t}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubscriptionTable;
