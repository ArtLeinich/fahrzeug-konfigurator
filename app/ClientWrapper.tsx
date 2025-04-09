"use client";

import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import { ToastProvider } from "@/context/ToastContext"; // Новый импорт

const queryClient = new QueryClient();

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AppProvider>
            <TooltipProvider>
              <Toaster richColors position="bottom-right" />
              {children}
            </TooltipProvider>
          </AppProvider>
        </ToastProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}