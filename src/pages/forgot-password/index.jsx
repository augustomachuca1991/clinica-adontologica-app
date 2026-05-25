import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import LoadSending from "@/components/ui/LoadSending";
import Icon from "@/components/AppIcon";
import { notifyError, notifySuccess } from "@/utils/notifications";
import { useAuth } from "@/contexts/AuthContext";
import Image from "@/components/AppImage";
import logo from "@/assets/images/orion-logotipo-claro.svg";

import { useFormik } from "formik";
import * as Yup from "yup";

const ForgotPassword = () => {
  const { t } = useTranslation();

  const { sendPasswordResetEmail } = useAuth();

  const validationSchema = Yup.object({
    email: Yup.string().email(t("login.errors.invalidEmail")).required(t("login.errors.required")),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const { error } = await sendPasswordResetEmail(values.email);
      if (error) {
        notifyError(t("forgotPassword.error"));
      } else {
        notifySuccess(t("forgotPassword.success"));
        formik.resetForm();
      }
    },
  });

  // Estado de carga combinado
  const isLoading = formik.isSubmitting;

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-muted/40 px-4 font-sans">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-clinical-md p-8">
        <div className="text-center mb-8">
          <div className="mx-auto mb-3 flex items-center justify-center rounded-xl bg-primary/10">
            <Image src={logo} alt="App Logo" className="h-14 md:h-18 w-auto object-contain" />
          </div>
          <p className="text-sm text-muted-foreground mt-2">{t("forgotPassword.subtitle")}</p>
        </div>

        {/* Formulario */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="relative">
            <Input
              label={t("forgotPassword.emailLabel")}
              type="email"
              name="email"
              placeholder={t("forgotPassword.emailPlaceholder")}
              className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all tracking-[-0.015em]"
              {...formik.getFieldProps("email")} // Reemplaza value y onChange
              error={formik.touched.email && formik.errors.email}
              required
            />
            <Icon
              name="Mail"
              size={18}
              className={`absolute left-3 ${formik.touched.email && formik.errors.email ? "top-[40px]" : "top-[38px]"} text-muted-foreground transition-all`}
            />
          </div>

          <Button type="submit" variant="default" className="w-full py-6" disabled={isLoading}>
            <LoadSending isLoading={isLoading} text={t("forgotPassword.submit")} />
          </Button>
        </form>

        {/* Footer del card */}
        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <Icon name="ArrowLeft" size={16} />
            {t("forgotPassword.backToLogin")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
