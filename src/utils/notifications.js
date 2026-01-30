import { toast } from "sonner";
import i18n from "@/i18n/index";

export const notifySuccess = (message) => toast.success(message);
export const notifyError = (message) => toast.error(message);
export const notifyInfo = (message) => toast(message);
export const notifyWarning = (message) => toast.warning(message);

export const notifyConfirm = (title, description, onConfirm) => {
  toast(title, {
    description: description,
    duration: Infinity,
    position: "top-center",
    important: true,
    action: {
      label: i18n.t("delete"),
      onClick: onConfirm,
    },
    cancel: {
      label: i18n.t("cancel"),
      onClick: () => {},
    },
  });
};
