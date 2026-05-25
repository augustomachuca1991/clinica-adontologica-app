import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import LoadSending from "@/components/ui/LoadSending";
import { notifyError, notifySuccess } from "@/utils/notifications";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import Spinner from "@/components/ui/Spinner";
import Image from "@/components/AppImage";
import logo from "@/assets/images/orion-logotipo-claro.svg";

import { useFormik } from "formik";
import * as Yup from "yup";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { updatePassword, signOut, loading: authLoading } = useAuth();
  const [isValidToken, setIsValidToken] = useState(false);
  const [checking, setChecking] = useState(true);

  const validationSchema = Yup.object({
    newPassword: Yup.string().min(6, t("login.errors.passwordShort")).required(t("login.errors.required")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], t("resetPassword.errors.mismatch")) // VALIDACIÓN CLAVE
      .required(t("login.errors.required")),
  });

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const { error } = await updatePassword(values.newPassword);
      if (error) {
        notifyError(error.message);
      } else {
        notifySuccess(t("resetPassword.success"));
        await signOut();
        navigate("/login", { replace: true });
      }
    },
  });

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        setIsValidToken(true);
      } else {
        notifyError(t("resetPassword.invalidOrExpired"));
        navigate("/login", { replace: true });
      }
      setChecking(false);
    };
    checkSession();
  }, [navigate, t]);

  const isLoading = formik.isSubmitting;

  if (checking)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size={40} />
      </div>
    );

  if (!isValidToken) return null;

  return (
    <div className=" min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <div className="relative w-full max-w-md bg-card rounded-2xl shadow-clinical-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <div className="absolute top-6 left-28 inline-flex items-center gap-2">
              <Image src={logo} alt="App Logo" className="h-14 md:h-18 w-auto object-contain" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">{t("resetPassword.subtitle")}</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Nueva Contraseña */}
          <section>
            <Input
              type="password"
              name="newPassword"
              label={t("resetPassword.newPasswordLabel")}
              placeholder={t("resetPassword.placeholder")}
              className="mt-1 w-full p-3 rounded-lg border bg-background text-sm tracking-[-0.015em] focus:ring-2 focus:ring-primary outline-none transition-all"
              {...formik.getFieldProps("newPassword")}
              error={formik.touched.newPassword && formik.errors.newPassword}
              required
            />
          </section>

          {/* Confirmar Contraseña */}
          <section>
            <Input
              type="password"
              name="confirmPassword"
              label={t("resetPassword.confirmPasswordLabel")}
              placeholder={t("resetPassword.placeholder")}
              className="mt-1 w-full p-3 rounded-lg border bg-background text-sm tracking-[-0.015em] focus:ring-2 focus:ring-primary outline-none transition-all"
              {...formik.getFieldProps("confirmPassword")}
              error={formik.touched.confirmPassword && formik.errors.confirmPassword}
              required
            />
          </section>

          <Button type="submit" variant="default" className="w-full py-6" disabled={isLoading}>
            <LoadSending isLoading={isLoading} text={t("resetPassword.submit")} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
