import { toast } from "vue-sonner";
import type { ExternalToast } from "vue-sonner";

export const useToast = () => {
  const success = (message: string, description?: string, options?: ExternalToast) => {
    toast.success(message, {
      position: "top-right",
      description,
      ...options,
    });
  };

  const error = (message: string, description?: string, options?: ExternalToast) => {
    toast.error(message, {
      position: "top-right",
      description,
      ...options,
    });
  };

  return {
    success,
    error,
  };
};
