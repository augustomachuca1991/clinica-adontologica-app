import React, { useState, useMemo, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { getValidationSchema } from "@/utils/adminUtils/admin";

const DURATIONS = [
  { value: "1", labelKey: "admin.duration.1month" },
  { value: "3", labelKey: "admin.duration.3months" },
  { value: "6", labelKey: "admin.duration.6months" },
  { value: "12", labelKey: "admin.duration.1year" },
];

const CreateSubscriptionForm = ({ users, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const searchContainerRef = useRef(null);

  // Schema creado dentro del componente para tener acceso a t()
  const validationSchema = useMemo(() => getValidationSchema(t), [t]);

  useEffect(() => {
    if (filteredUsers.length === 0) return;
    const handler = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setFilteredUsers([]);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [filteredUsers]);

  const formik = useFormik({
    initialValues: { userId: "", userName: "", duration: "1" },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      await onSubmit(values);
      resetForm();
      setSearchTerm("");
      setFilteredUsers([]);
    },
  });

  const handleSearchFocus = () => {
    const sorted = [...users].sort((a, b) => a.full_name?.localeCompare(b.full_name));
    setFilteredUsers(sorted);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (formik.values.userId) {
      formik.setValues({ ...formik.values, userId: "", userName: "" });
    }

    setFilteredUsers(
      users.filter(
        (u) =>
          u.full_name?.toLowerCase().includes(value.toLowerCase()) ||
          u.email?.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleSelectUser = (u) => {
    formik.setValues({ ...formik.values, userId: u.id, userName: u.full_name });
    formik.setFieldTouched("userId", true);
    setSearchTerm("");
    setFilteredUsers([]);
  };

  const handleClearUser = () => {
    formik.setValues({ ...formik.values, userId: "", userName: "" });
    formik.setFieldTouched("userId", false);
  };

  const hasUserError = formik.touched.userId && formik.errors.userId;

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">{t("admin.form.title")}</h2>
        <button
          type="button"
          onClick={() => {
            formik.resetForm();
            setSearchTerm("");
            setFilteredUsers([]);
            onCancel?.();
          }}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {t("common.actions.cancel")}
        </button>
      </div>

      <form className="space-y-5" onSubmit={formik.handleSubmit}>
        {/* ── Select User ── */}
        <div className="space-y-1.5 relative">
          <label className="text-xs font-medium text-muted-foreground">{t("admin.form.selectUser")}</label>

          <div className="relative">
            <input
              type="text"
              placeholder={t("admin.form.searchPlaceholder")}
              value={formik.values.userName || searchTerm}
              onFocus={handleSearchFocus}
              onChange={handleSearchChange}
              onBlur={() => formik.setFieldTouched("userId", true)}
              className={`w-full px-3 py-2 bg-background border rounded-lg text-sm text-foreground pr-8 focus:outline-none focus:ring-2 transition-all ${
                hasUserError
                  ? "border-red-400 focus:ring-red-200"
                  : "border-border focus:ring-primary/20 focus:border-primary"
              }`}
            />
            <span className="absolute inset-y-0 right-3 flex items-center text-[10px] text-muted-foreground pointer-events-none">
              ▼
            </span>
          </div>

          {/* Error */}
          {hasUserError && <p className="text-red-500 text-[11px]">{formik.errors.userId}</p>}

          {/* Dropdown */}
          {filteredUsers.length > 0 && !formik.values.userId && (
            <div className="absolute z-50 w-full bg-popover border border-border rounded-lg shadow-lg mt-1">
              <div className="text-[10px] font-semibold text-muted-foreground px-3 py-1.5 bg-muted/50 uppercase tracking-wider rounded-t-lg border-b border-border">
                {t("admin.form.usersCount", { count: filteredUsers.length })}
              </div>
              <ul className="max-h-52 overflow-y-auto divide-y divide-border">
                {filteredUsers.map((u) => (
                  <li
                    key={u.id}
                    onMouseDown={(e) => e.preventDefault()} // evita que onBlur se dispare antes del click
                    onClick={() => handleSelectUser(u)}
                    className="px-3 py-2 hover:bg-primary/10 cursor-pointer text-xs flex flex-col gap-0.5 transition-colors"
                  >
                    <span className="font-medium text-foreground">{u.full_name}</span>
                    <span className="text-muted-foreground text-[11px]">{u.email}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sin resultados */}
          {searchTerm && filteredUsers.length === 0 && !formik.values.userId && (
            <div className="absolute z-50 w-full bg-popover border border-border rounded-lg p-3 text-center text-xs text-muted-foreground mt-1 shadow-md">
              {t("admin.form.noMatches")}
            </div>
          )}

          {/* Usuario seleccionado */}
          {formik.values.userId && (
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
              <p className="text-[11px] text-emerald-700 font-medium">✓ {formik.values.userName}</p>
              <button
                type="button"
                onClick={handleClearUser}
                className="text-[11px] text-red-500 hover:underline font-medium"
              >
                {t("admin.form.changeUser")}
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-border" />

        {/* ── Duration ── */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">{t("admin.form.durationLabel")}</label>
          <div className="grid grid-cols-2 gap-2">
            {DURATIONS.map((p) => (
              <label
                key={p.value}
                className={`flex items-center justify-center py-2.5 px-3 rounded-lg border cursor-pointer text-xs text-center transition-all ${
                  formik.values.duration === p.value
                    ? "bg-primary/10 border-primary text-primary font-medium"
                    : "bg-muted/40 border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <input
                  type="radio"
                  name="duration"
                  value={p.value}
                  checked={formik.values.duration === p.value}
                  onChange={() => formik.setFieldValue("duration", p.value)}
                  className="sr-only"
                />
                {t(p.labelKey)}
              </label>
            ))}
          </div>
          {formik.touched.duration && formik.errors.duration && (
            <p className="text-red-500 text-[11px]">{formik.errors.duration}</p>
          )}
        </div>

        {/* ── Submit ── */}
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {formik.isSubmitting ? t("admin.form.processing") : t("admin.form.submit")}
        </button>
      </form>
    </div>
  );
};

export default CreateSubscriptionForm;
