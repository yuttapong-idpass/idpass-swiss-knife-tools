import type { ReactNode } from "react"
import { toast, type ExternalToast } from "sonner"

const defaultToastOptions: ExternalToast = {
  position: "top-center",
  closeButton: true,
  duration: 3000,
}

function withDefaults(options?: ExternalToast): ExternalToast {
  return {
    ...defaultToastOptions,
    ...options,
  }
}

export const appToast = {
  success(message: ReactNode, options?: ExternalToast) {
    return toast.success(message, withDefaults(options))
  },
  error(message: ReactNode, options?: ExternalToast) {
    return toast.error(message, withDefaults(options))
  },
  warning(message: ReactNode, options?: ExternalToast) {
    return toast.warning(message, withDefaults(options))
  },
  info(message: ReactNode, options?: ExternalToast) {
    return toast.info(message, withDefaults(options))
  },
}

