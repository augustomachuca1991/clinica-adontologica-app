import { toast } from "sonner";

export const notifySuccess = (message) => toast.success(message);
export const notifyError = (message) => toast.error(message);
export const notifyInfo = (message) => toast(message);
export const notifyWarning = (message) => toast.warning(message);
