import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import FooterLogin from "@/pages/login/components/FooterLogin";
import { useTranslation } from "react-i18next";
import Spinner from "@/components/ui/Spinner";
import LoadSending from "@/components/ui/LoadSending";
import Image from "@/components/AppImage";
import logo from "@/assets/images/orion-logotipo-claro.svg";
import { useAuth } from "@/contexts/AuthContext";
import { notifyError, notifySuccess } from "@/utils/notifications";

import { useFormik } from "formik";
import * as Yup from "yup";

const Login = () => {
  const { signIn, loading } = useAuth();
  const { t } = useTranslation();
  const APP_NAME = import.meta.env?.VITE_APP_NAME || "Dental Care";

  const validationSchema = Yup.object({
    email: Yup.string().email(t("login.errors.invalidEmail")).required(t("login.errors.required")),
    password: Yup.string().min(6, t("login.errors.passwordShort")).required(t("login.errors.required")),
  });

  const formik = useFormik({
    initialValues: {
      email: localStorage.getItem("remembered_email") || "",
      password: "",
      rememberMe: !!localStorage.getItem("remembered_email"),
    },
    validationSchema,
    onSubmit: async (values) => {
      if (values.rememberMe) {
        localStorage.setItem("remembered_email", values.email);
      } else {
        localStorage.removeItem("remembered_email");
      }
      const { error } = await signIn(values.email, values.password);
      if (error) notifyError(error.message);
      else notifySuccess(t("welcome"));
    },
  });

  const isLoading = loading || formik.isSubmitting;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40">
        <Spinner size={56} />
        <p className="mt-4 text-muted-foreground animate-pulse">{t("workspace")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-clinical-md p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex items-center justify-center rounded-xl ">
            <Image src={logo} alt="App Logo" className="h-14 md:h-18 w-auto object-contain" />
          </div>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          <div className="space-y-4">
            <section>
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="email@ejemplo.com"
                className="mt-1 w-full rounded-lg border p-3 text-sm focus:ring-2 focus:ring-primary tracking-[-0.015em]"
                {...formik.getFieldProps("email")}
                error={formik.touched.email && formik.errors.email}
                required
              />
            </section>

            <section>
              <Input
                label={t("login.password")}
                type="password"
                name="password"
                placeholder="••••••••"
                className="mt-1 w-full rounded-lg border p-3 text-sm focus:ring-2 focus:ring-primary tracking-[-0.015em]"
                {...formik.getFieldProps("password")}
                error={formik.touched.password && formik.errors.password}
                required
              />
            </section>

            <div className="flex items-center justify-between">
              <Checkbox
                label={t("login.rememberMe")}
                id="rememberMe"
                name="rememberMe"
                checked={formik.values.rememberMe}
                onChange={formik.handleChange}
                className="mt-1 focus:ring-2 focus:ring-primary tracking-[-0.015em]"
              />
            </div>

            <Button variant="default" className="w-full" type="submit" disabled={isLoading}>
              <LoadSending isLoading={isLoading} text={t("login.submit")} />
            </Button>
          </div>
        </form>
        <FooterLogin />
      </div>
    </div>
  );
};

export default Login;
