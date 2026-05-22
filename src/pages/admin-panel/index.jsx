import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSubscription } from "@/hooks/SubscriptionHooks";
import { supabase } from "@/lib/supabase";
import { useUserRegistration } from "@/hooks/UserHooks";

function getInitials(name) {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() || "")
    .slice(0, 2)
    .join("");
}

const AVATAR_COLORS = [
  { bg: "bg-purple-100 text-purple-800" },
  { bg: "bg-emerald-100 text-emerald-800" },
  { bg: "bg-orange-100 text-orange-800" },
  { bg: "bg-blue-100 text-blue-800" },
  { bg: "bg-pink-100 text-pink-800" },
];

function getAvatarColor(name) {
  if (!name) return AVATAR_COLORS[0].bg;
  let h = 0;
  for (let c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return AVATAR_COLORS[h % AVATAR_COLORS.length].bg;
}

function daysLeft(iso) {
  return Math.ceil((new Date(iso) - new Date()) / 86400000);
}

// Formateadores dinámicos según el idioma activo
function fmtDate(iso, lng) {
  return new Date(iso).toLocaleDateString(lng, { day: "2-digit", month: "short", year: "numeric" });
}

function fmtDateTime(iso, lng) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString(lng, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const AdminPanel = () => {
  const { t, i18n } = useTranslation();
  const currentLng = i18n.language; // Captura el idioma actual para las fechas

  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [viewingSub, setViewingSub] = useState(null);
  const [renewalDate, setRenewalDate] = useState(new Date().toISOString().split("T")[0]);
  const [isRenewing, setIsRenewing] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState({
    userId: "",
    userName: "",
    duration: "1",
  });
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { subscriptions, loading, error, renewSubscription, refresh } = useSubscription();
  const { users, loadingUsers, fetchUsers } = useUserRegistration();

  // Función para obtener el estado visual traducido dinámicamente
  const obtenerEstadoVisual = (subscription) => {
    const hoy = new Date();
    const finPeriodo = new Date(subscription.current_period_end);

    const diferenciaTiempo = hoy - finPeriodo;
    const diasVencido = Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24));

    if (hoy <= finPeriodo) {
      const diasRestantes = Math.ceil((finPeriodo - hoy) / (1000 * 60 * 60 * 24));
      return {
        key: "active",
        texto: t("admin.status.active"),
        claseBg: "bg-emerald-100 text-emerald-800",
        claseCirculo: "bg-emerald-500",
        textoDias: t("admin.status.expiresIn", { count: diasRestantes }),
        claseTextoDias: "text-muted-foreground",
      };
    } else if (diasVencido <= 5) {
      return {
        key: "grace",
        texto: t("admin.status.grace"),
        claseBg: "bg-amber-100 text-amber-800",
        claseCirculo: "bg-amber-500",
        textoDias: t("admin.status.expiredAgo", { count: diasVencido }),
        claseTextoDias: "text-amber-500",
      };
    } else {
      return {
        key: "expired",
        texto: t("admin.status.inactive"),
        claseBg: "bg-red-100 text-red-700",
        claseCirculo: "bg-red-500",
        textoDias: t("admin.status.expiredAgo", { count: diasVencido }),
        claseTextoDias: "text-red-500",
      };
    }
  };

  const handleOpenRenewModal = (subscription) => {
    setSelectedSub(subscription);
    setOpenMenuId(null);
  };

  const handleOpenViewModal = (subscription) => {
    setViewingSub(subscription);
    setOpenMenuId(null);
  };

  const handleConfirmRenewal = async () => {
    if (!selectedSub) return;
    setIsRenewing(true);

    const result = await renewSubscription(selectedSub.id, renewalDate);

    setIsRenewing(false);
    if (result.success) {
      setSelectedSub(null);
    } else {
      alert(t("admin.alerts.renewError") + result.error);
    }
  };

  const handleCreateSubscription = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!subscriptionData.userId) {
      setFormError(t("admin.form.errors.selectUser"));
      return;
    }

    setIsSubmitting(true);

    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(startDate.getMonth() + parseInt(subscriptionData.duration));

      const { error } = await supabase.from("subscriptions").insert([
        {
          user_id: subscriptionData.userId,
          status: "active",
          current_period_end: endDate.toISOString(),
        },
      ]);

      if (error) throw error;

      alert(t("admin.alerts.createSuccess"));

      setSearchTerm("");
      setSubscriptionData({ userId: "", userName: "", duration: "1" });

      if (typeof refresh === "function") await refresh();
      if (typeof fetchUsers === "function") await fetchUsers();
    } catch (err) {
      console.error(err);
      setFormError(err.message || t("admin.form.errors.processError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 fade-in-up">
      {/* HEADER */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("admin.header.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("admin.header.subtitle")}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* TABLA */}
        <section className="lg:col-span-8">
          <div className="clinical-card overflow-visible">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin">⚙️</div>
                <p className="text-muted-foreground mt-2">{t("admin.table.loading")}</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-red-600">{t("admin.table.error", { error })}</p>
              </div>
            ) : subscriptions.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">{t("admin.table.empty")}</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse overflow-visible">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t("admin.table.thUser")}
                    </th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t("admin.table.thStatus")}
                    </th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t("admin.table.thExpiration")}
                    </th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t("admin.table.thActions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {subscriptions.map((subscription) => {
                    const p = subscription.user_profiles || {};
                    const days = daysLeft(subscription.current_period_end);
                    const estado = obtenerEstadoVisual(subscription);

                    const isExpired = estado.key === "expired";
                    const isGrace = estado.key === "grace";

                    return (
                      <tr key={subscription.id} className="hover:bg-muted/20 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${getAvatarColor(p.full_name)}`}
                            >
                              {getInitials(p.full_name)}
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="font-medium text-sm text-foreground">
                                {p.full_name || t("admin.table.noName")}
                              </span>
                              <span className="text-xs text-muted-foreground">{p.email || "-"}</span>
                              <span className="text-[10px] text-muted-foreground font-mono">
                                @{p.username || "sin-user"}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${estado.claseBg}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${estado.claseCirculo}`} />
                            {estado.texto}
                          </span>
                        </td>

                        <td className="p-4">
                          <div
                            className={`text-sm font-medium ${isExpired ? "text-red-600" : isGrace ? "text-amber-600" : "text-foreground"}`}
                          >
                            {fmtDate(subscription.current_period_end, currentLng)}
                          </div>
                          <div className={`text-[10px] mt-0.5 ${estado.claseTextoDias}`}>{estado.textoDias}</div>
                        </td>

                        <td className="p-4 overflow-visible">
                          <div className="relative overflow-visible">
                            <button
                              onClick={() => setOpenMenuId(openMenuId === subscription.id ? null : subscription.id)}
                              className="p-2 hover:bg-muted rounded-full transition-all hover:scale-110 text-muted-foreground font-bold tracking-widest"
                            >
                              •••
                            </button>
                            {openMenuId === subscription.id && (
                              <div className="absolute right-0 top-full mt-1 bg-background border border-border rounded-lg shadow-lg z-10 min-w-[160px]">
                                <button
                                  onClick={() => handleOpenViewModal(subscription)}
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

                                {(isExpired || isGrace) && (
                                  <button
                                    onClick={() => handleOpenRenewModal(subscription)}
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
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* FORMULARIO LATERAL */}
        <aside className="lg:col-span-4 sticky top-6">
          <div className="bg-card border border-border rounded-xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">{t("admin.form.title")}</h2>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSubscriptionData({ userId: "", userName: "", duration: "1" });
                }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("admin.form.cancel")}
              </button>
            </div>

            <form className="space-y-5" onSubmit={handleCreateSubscription}>
              <div className="space-y-1.5 relative">
                <label className="text-xs font-medium text-muted-foreground">{t("admin.form.selectUser")}</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t("admin.form.searchPlaceholder")}
                    value={subscriptionData.userName || searchTerm}
                    onFocus={() => {
                      const sorted = [...users].sort((a, b) => a.full_name?.localeCompare(b.full_name));
                      setFilteredUsers(sorted);
                    }}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSearchTerm(value);

                      if (subscriptionData.userId) {
                        setSubscriptionData({ ...subscriptionData, userId: "", userName: "" });
                      }

                      const filtered = users.filter(
                        (u) =>
                          u.full_name?.toLowerCase().includes(value.toLowerCase()) ||
                          u.email?.toLowerCase().includes(value.toLowerCase())
                      );
                      setFilteredUsers(filtered);
                    }}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground pr-8 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center text-[10px] text-muted-foreground pointer-events-none">
                    ▼
                  </span>
                </div>

                {filteredUsers.length > 0 && !subscriptionData.userId && (
                  <div className="absolute z-50 w-full bg-popover border border-border rounded-lg shadow-lg mt-1">
                    <div className="text-[10px] font-semibold text-muted-foreground px-3 py-1.5 bg-muted/50 uppercase tracking-wider rounded-t-lg border-b border-border">
                      {t("admin.form.usersCount", { count: filteredUsers.length })}
                    </div>
                    <ul className="max-h-52 overflow-y-auto divide-y divide-border">
                      {filteredUsers.map((u) => (
                        <li
                          key={u.id}
                          onClick={() => {
                            setSubscriptionData({ ...subscriptionData, userId: u.id, userName: u.full_name });
                            setSearchTerm("");
                            setFilteredUsers([]);
                          }}
                          className="px-3 py-2 hover:bg-primary/10 cursor-pointer text-xs flex flex-col gap-0.5 transition-colors"
                        >
                          <span className="font-medium text-foreground">{u.full_name}</span>
                          <span className="text-muted-foreground text-[11px]">{u.email}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {searchTerm && filteredUsers.length === 0 && (
                  <div className="absolute z-50 w-full bg-popover border border-border rounded-lg p-3 text-center text-xs text-muted-foreground mt-1 shadow-md">
                    {t("admin.form.noMatches")}
                  </div>
                )}

                {subscriptionData.userId && (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                    <p className="text-[11px] text-emerald-700 font-medium">✓ {subscriptionData.userName}</p>
                    <button
                      type="button"
                      onClick={() => setSubscriptionData({ userId: "", userName: "", duration: "1" })}
                      className="text-[11px] text-red-500 hover:underline font-medium"
                    >
                      {t("admin.form.changeUser")}
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t border-border" />

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">{t("admin.form.durationLabel")}</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "1", label: t("admin.duration.1month") },
                    { value: "3", label: t("admin.duration.3months") },
                    { value: "6", label: t("admin.duration.6months") },
                    { value: "12", label: t("admin.duration.1year") },
                  ].map((p) => (
                    <label
                      key={p.value}
                      className={`flex items-center justify-center py-2.5 px-3 rounded-lg border cursor-pointer text-xs text-center transition-all ${
                        subscriptionData.duration === p.value
                          ? "bg-primary/10 border-primary text-primary font-medium"
                          : "bg-muted/40 border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      <input
                        type="radio"
                        name="duration"
                        value={p.value}
                        checked={subscriptionData.duration === p.value}
                        onChange={(e) => setSubscriptionData({ ...subscriptionData, duration: e.target.value })}
                        className="sr-only"
                      />
                      {p.label}
                    </label>
                  ))}
                </div>
              </div>

              {formError && <p className="text-red-500 text-xs">{formError}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isSubmitting ? t("admin.form.processing") : t("admin.form.submit")}
              </button>
            </form>
          </div>
        </aside>
      </div>

      {/* MODAL RENOVACIÓN */}
      {selectedSub && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-background border border-border rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4 mx-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">{t("admin.modals.renew.title")}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t("admin.modals.renew.description")}</p>
            </div>
            <div className="bg-muted/40 p-3 rounded-lg text-xs space-y-1 text-muted-foreground">
              <p>
                <strong className="text-foreground">{t("admin.modals.shared.user")}:</strong>{" "}
                {selectedSub.user_profiles?.full_name}
              </p>
              <p>
                <strong className="text-foreground">{t("admin.modals.shared.email")}:</strong>{" "}
                {selectedSub.user_profiles?.email}
              </p>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">{t("admin.modals.renew.startDate")}</label>
              <input
                type="date"
                value={renewalDate}
                onChange={(e) => setRenewalDate(e.target.value)}
                className="w-full p-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                disabled={isRenewing}
                className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
              >
                {t("admin.modals.shared.cancel")}
              </button>
              <button
                type="button"
                onClick={handleConfirmRenewal}
                disabled={isRenewing}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                {isRenewing ? t("admin.form.processing") : t("admin.modals.renew.confirmBtn")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VER DETALLES */}
      {viewingSub && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-background border border-border rounded-xl p-6 w-full max-w-lg shadow-2xl space-y-5 mx-4 relative">
            <header className="pr-8">
              <h3 className="text-xl font-bold text-foreground">{t("admin.modals.view.title")}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t("admin.modals.view.idLabel")}: {viewingSub.id || viewingSub.user_id}
              </p>
            </header>
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("admin.modals.view.userDataSection")}
              </h4>
              <div className="flex items-center gap-3 bg-muted/30 p-3 rounded-lg border border-border">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold ${getAvatarColor(viewingSub.user_profiles?.full_name || "U")}`}
                >
                  {getInitials(viewingSub.user_profiles?.full_name || "U")}
                </div>
                <div>
                  <h5 className="font-semibold text-sm text-foreground">
                    {viewingSub.user_profiles?.full_name || t("admin.table.noName")}
                  </h5>
                  <p className="text-xs text-muted-foreground">{viewingSub.user_profiles?.email}</p>
                  <p className="text-[11px] font-mono text-primary mt-0.5">@{viewingSub.user_profiles?.username}</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("admin.modals.view.statusSection")}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/30 p-3 rounded-lg border border-border flex flex-col justify-between">
                  <span className="text-[11px] text-muted-foreground">{t("admin.modals.view.currentStatus")}</span>
                  <span
                    className={`inline-flex items-center gap-1.5 mt-1 self-start px-2.5 py-0.5 rounded-full text-xs font-medium ${viewingSub.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${viewingSub.status === "active" ? "bg-emerald-500" : "bg-red-500"}`}
                    />
                    {viewingSub.status === "active" ? t("admin.status.active") : t("admin.status.inactive")}
                  </span>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg border border-border">
                  <span className="text-[11px] text-muted-foreground">{t("admin.modals.view.remainingDays")}</span>
                  <p
                    className={`text-base font-bold mt-1 ${daysLeft(viewingSub.current_period_end) <= 0 ? "text-red-500" : "text-foreground"}`}
                  >
                    {daysLeft(viewingSub.current_period_end) <= 0
                      ? t("admin.modals.view.expiredLabel")
                      : t("admin.modals.view.daysCount", { count: daysLeft(viewingSub.current_period_end) })}
                  </p>
                </div>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg border border-border space-y-2 text-xs">
                <div className="flex justify-between border-b border-border/50 pb-1.5">
                  <span className="text-muted-foreground">{t("admin.modals.view.createdAt")}:</span>
                  <span className="font-medium text-foreground">{fmtDateTime(viewingSub.created_at, currentLng)}</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-muted-foreground">{t("admin.modals.view.nextExpiration")}:</span>
                  <span
                    className={`font-semibold ${daysLeft(viewingSub.current_period_end) <= 0 ? "text-red-500" : "text-foreground"}`}
                  >
                    {fmtDateTime(viewingSub.current_period_end, currentLng)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setViewingSub(null)}
                className="w-full sm:w-auto px-5 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors border border-border"
              >
                {t("admin.modals.view.closeBtn")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
