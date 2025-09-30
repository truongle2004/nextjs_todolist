import { toast, type ToastOptions } from 'react-toastify';

export const sucessToast = (message: string, options?: ToastOptions) => {
  toast.success(message, {
    ...options,
  });
};

export const errorToast = (message: string, options?: ToastOptions) => {
  toast.error(message, {
    ...options,
  });
};

export const warningToast = (message: string, options?: ToastOptions) => {
  toast.warning(message, {
    ...options,
  });
};
