import { toast } from "react-toastify";
import styles from 'styles/modules/Toasts.module.scss';

export const showSuccess = (message) => {
  toast(message, {
    className: styles.success,
  });
};
export const showError = (message) => {
  toast(message, {
    className: styles.error,
  });
};

