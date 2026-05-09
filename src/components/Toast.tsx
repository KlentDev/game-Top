import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useEffect } from 'react';
import { type ToastItem, useToast } from '../context/ToastContext';

const ICON_MAP = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
} as const;

function ToastCard({ item }: { item: ToastItem }) {
  const { dismiss } = useToast();
  const Icon = ICON_MAP[item.kind];

  useEffect(() => {
    const t = setTimeout(() => dismiss(item.id), 4200);
    return () => clearTimeout(t);
  }, [item.id, dismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.93 }}
      transition={{ duration: 0.2 }}
      className={`toast-item toast-${item.kind}`}
    >
      <Icon className="toast-icon" />
      <div className="toast-body">
        <p className="toast-title">{item.title}</p>
        {item.body && <p className="toast-sub">{item.body}</p>}
      </div>
      <button
        className="toast-x"
        onClick={() => dismiss(item.id)}
        aria-label="Dismiss notification"
      >
        <X />
      </button>
    </motion.div>
  );
}

export function ToastShelf() {
  const { toasts } = useToast();
  return (
    <div className="toast-shelf" aria-live="polite" aria-atomic="false">
      <AnimatePresence>
        {toasts.map((item) => (
          <ToastCard key={item.id} item={item} />
        ))}
      </AnimatePresence>
    </div>
  );
}
