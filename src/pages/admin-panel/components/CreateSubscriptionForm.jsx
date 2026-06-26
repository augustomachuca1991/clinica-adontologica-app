import React, { useState, useMemo, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";

const CreateSubscriptionForm = ({ users, onSubmit }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const blurTimeoutRef = useRef(null);

  const validationSchema = useMemo(
    () =>
      Yup.object({
        userId: Yup.string().required(t("admin.errors.userRequired")),
        startDate: Yup.date()
          .min(new Date().toISOString().split("T")[0], "La fecha debe ser hoy o posterior")
          .required("Requerido"),
        endDate: Yup.date()
          .min(Yup.ref("startDate"), "Debe ser posterior a la fecha de inicio")
          .required("Requerido"),
        plan: Yup.string().required("Requerido"),
      }),
    [t]
  );

  useEffect(() => () => { if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current); }, []);

  const hideDropdown = () => {
    setFilteredUsers([]);
    setSearchTerm("");
  };

  const formik = useFormik({
    initialValues: {
      userId: "",
      userName: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      plan: "monthly",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      await onSubmit(values);
      resetForm();
      hideDropdown();
    },
  });

  const handleSearchFocus = () => {
    if (formik.values.userId) return;
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
    hideDropdown();
  };

  const handleClearUser = () => {
    formik.setValues({ ...formik.values, userId: "", userName: "" });
    formik.setFieldTouched("userId", false);
    setSearchTerm("");
  };

  const handleInputBlur = () => {
    formik.setFieldTouched("userId", true);
    blurTimeoutRef.current = setTimeout(hideDropdown, 120);
  };

  const handleItemMouseDown = (e) => {
    e.preventDefault();
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
  };

  useEffect(() => {
    if (formik.values.startDate && formik.values.plan) {
      const start = new Date(formik.values.startDate);
      const end = new Date(start);
      if (formik.values.plan === "yearly") {
        end.setFullYear(end.getFullYear() + 1);
      } else {
        end.setMonth(end.getMonth() + 1);
      }
      formik.setFieldValue("endDate", end.toISOString().split("T")[0]);
    }
  }, [formik.values.startDate, formik.values.plan]);

  const hasUserError = formik.touched.userId && formik.errors.userId;

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="inline-block px-2 py-1 text-[11px] font-semibold rounded bg-primary/10 text-primary">
        {t("admin.form.title")}
      </div>

      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c5cbf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        {t("admin.form.createTitle")}
      </div>

      <form className="space-y-3" onSubmit={formik.handleSubmit}>
        <div className="space-y-1.5 relative">
          <label className="text-xs text-muted-foreground">{t("admin.form.selectUser")}</label>

          <input
            type="text"
            placeholder={t("admin.form.searchPlaceholder")}
            value={formik.values.userName || searchTerm}
            onFocus={handleSearchFocus}
            onChange={handleSearchChange}
            onBlur={handleInputBlur}
            className={`w-full px-3 py-2 bg-background border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 transition-all ${
              hasUserError
                ? "border-red-400 focus:ring-red-200"
                : "border-border focus:ring-primary/20 focus:border-primary"
            }`}
          />

          {hasUserError && <p className="text-red-500 text-[11px]">{formik.errors.userId}</p>}

          {filteredUsers.length > 0 && !formik.values.userId && (
            <div className="absolute z-50 w-full bg-popover border border-border rounded-lg shadow-lg mt-1">
              <div className="text-[10px] font-semibold text-muted-foreground px-3 py-1.5 bg-muted/50 uppercase tracking-wider rounded-t-lg border-b border-border">
                {t("admin.form.usersCount", { count: filteredUsers.length })}
              </div>
              <ul className="max-h-52 overflow-y-auto divide-y divide-border">
                {filteredUsers.map((u) => (
                  <li
                    key={u.id}
                    onMouseDown={handleItemMouseDown}
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

          {searchTerm && filteredUsers.length === 0 && !formik.values.userId && (
            <div className="absolute z-50 w-full bg-popover border border-border rounded-lg p-3 text-center text-xs text-muted-foreground mt-1 shadow-md">
              {t("admin.form.noMatches")}
            </div>
          )}

          {formik.values.userId && (
            <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
              <p className="text-[11px] text-emerald-300 font-medium">✓ {formik.values.userName}</p>
              <button type="button" onClick={handleClearUser} className="text-[11px] text-red-500 hover:underline font-medium">
                {t("admin.form.changeUser")}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">{t("admin.form.startDate")}</label>
            <input
              type="date"
              name="startDate"
              value={formik.values.startDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            {formik.touched.startDate && formik.errors.startDate && (
              <p className="text-red-500 text-[11px]">{formik.errors.startDate}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">{t("admin.form.endDate")}</label>
            <input
              type="date"
              name="endDate"
              value={formik.values.endDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            {formik.touched.endDate && formik.errors.endDate && (
              <p className="text-red-500 text-[11px]">{formik.errors.endDate}</p>
            )}
          </div>
        </div>

        <div className="border-t border-border" />

        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">{t("admin.form.plan")}</label>
          <select
            name="plan"
            value={formik.values.plan}
            onChange={formik.handleChange}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="monthly">{t("admin.plans.monthly")}</option>
            <option value="yearly">{t("admin.plans.yearly")}</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
          style={{ backgroundColor: "#7c5cbf" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14" /><path d="M5 12h14" />
          </svg>
          {formik.isSubmitting ? t("admin.form.processing") : t("admin.form.submit")}
        </button>
      </form>
    </div>
  );
};

export default CreateSubscriptionForm;