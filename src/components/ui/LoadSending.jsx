import React from "react";
import Spinner from "@components/ui/Spinner";
import { useTranslation } from "react-i18next";

const LoadSending = ({ isLoading, text = "" }) => {
  const { t } = useTranslation();
  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <Spinner size={16} />
          <span>{t("login.sending") || "..."}</span>
        </div>
      ) : (
        <span>{text}</span>
      )}
    </>
  );
};

export default LoadSending;
