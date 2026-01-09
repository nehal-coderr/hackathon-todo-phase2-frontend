// Task ID: T075 - Client-side providers wrapper
"use client";

import { ReactNode } from "react";
import { ToastProvider } from "./Toast";

/**
 * Client-side providers wrapper.
 * Wraps children with all client-side context providers.
 */
export function Providers({ children }: { children: ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
