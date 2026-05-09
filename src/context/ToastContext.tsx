import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useState } from 'react';

export type ToastKind = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  kind: ToastKind;
  title: string;
  body?: string;
}

interface ToastCtx {
  toasts: ToastItem[];
  toast: (kind: ToastKind, title: string, body?: string) => void;
  dismiss: (id: string) => void;
}

const Ctx = createContext<ToastCtx>({ toasts: [], toast: () => {}, dismiss: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((kind: ToastKind, title: string, body?: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev.slice(-4), { id, kind, title, body }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return <Ctx.Provider value={{ toasts, toast, dismiss }}>{children}</Ctx.Provider>;
}

export function useToast() {
  return useContext(Ctx);
}
