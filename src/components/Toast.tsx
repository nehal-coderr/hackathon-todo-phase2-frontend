// Task ID: T075 - Toast notification component with animations and accessibility
"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

/**
 * Toast notification types with distinct visual styles.
 */
export type ToastType = "success" | "error" | "loading";

/**
 * Toast notification data structure.
 */
interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number; // Auto-dismiss duration in ms (0 = no auto-dismiss)
}

/**
 * Toast context value for managing notifications.
 */
interface ToastContextValue {
  toasts: Toast[];
  showToast: (type: ToastType, message: string, duration?: number) => string;
  hideToast: (id: string) => void;
  success: (message: string, duration?: number) => string;
  error: (message: string, duration?: number) => string;
  loading: (message: string) => string;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Hook to access toast notifications.
 */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

/**
 * Generate unique ID for toast.
 */
function generateId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Toast provider component.
 * Wraps the application to enable toast notifications.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, message: string, duration?: number): string => {
      const id = generateId();
      const toast: Toast = {
        id,
        type,
        message,
        duration: duration ?? (type === "loading" ? 0 : 4000), // Loading toasts don't auto-dismiss
      };

      setToasts((prev) => [...prev, toast]);
      return id;
    },
    []
  );

  // Convenience methods
  const success = useCallback(
    (message: string, duration?: number) => showToast("success", message, duration ?? 4000),
    [showToast]
  );

  const error = useCallback(
    (message: string, duration?: number) => showToast("error", message, duration ?? 5000),
    [showToast]
  );

  const loading = useCallback(
    (message: string) => showToast("loading", message, 0),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast, success, error, loading }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={hideToast} />
    </ToastContext.Provider>
  );
}

/**
 * Toast container component.
 * Renders all active toasts in a fixed position.
 */
function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

/**
 * Individual toast item component.
 * T075: Distinct visual styles, icons, animations, accessibility.
 */
function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Entrance animation
  useEffect(() => {
    // Trigger entrance animation after mount
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Auto-dismiss timer
  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => onDismiss(toast.id), 200);
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, toast.id, onDismiss]);

  const handleDismiss = () => {
    setIsExiting(true);
    // Wait for exit animation before removing
    setTimeout(() => onDismiss(toast.id), 200);
  };

  // T075: Style configuration per type
  const styles = {
    success: {
      bg: "bg-green-50 border-green-200",
      text: "text-green-800",
      icon: (
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    error: {
      bg: "bg-red-50 border-red-200",
      text: "text-red-800",
      icon: (
        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
    loading: {
      bg: "bg-blue-50 border-blue-200",
      text: "text-blue-800",
      icon: (
        <svg className="w-5 h-5 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ),
    },
  };

  const style = styles[toast.type];

  return (
    <div
      role={toast.type === "error" ? "alert" : "status"}
      aria-live={toast.type === "error" ? "assertive" : "polite"}
      className={`
        pointer-events-auto flex items-start gap-3 p-4 rounded-lg border shadow-lg
        ${style.bg} ${style.text}
        transform transition-all duration-200 ease-out
        ${isVisible && !isExiting ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
    >
      {/* Icon */}
      <div className="flex-shrink-0" aria-hidden="true">
        {style.icon}
      </div>

      {/* Message */}
      <p className="flex-grow text-sm font-medium">{toast.message}</p>

      {/* Dismiss button (not shown for loading) */}
      {toast.type !== "loading" && (
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors"
          aria-label="Dismiss notification"
        >
          <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
