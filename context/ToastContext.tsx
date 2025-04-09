"use client";

import React, { createContext, useContext } from "react";
import { toast } from "sonner";

interface ToastOptions {
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  showToast: (message: string, type: "success" | "error" | "info", options?: ToastOptions) => void;
  dismissToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const showToast = (
    message: string,
    type: "success" | "error" | "info",
    options: ToastOptions = {}
  ) => {
    const { description, duration = 2000, action } = options;

    toast[type](message, {
      description,
      duration,
      position: "bottom-right",
      action: action
        ? {
            label: action.label,
            onClick: action.onClick,
          }
        : undefined,
    });
  };

  const dismissToast = () => {
    toast.dismiss();
  };

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
};