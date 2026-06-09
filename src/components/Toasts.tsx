import { useCallback, useRef, useState } from 'react';

export type Toast = { id: number; text: string };

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const push = useCallback((text: string) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2600);
  }, []);

  return { toasts, push };
}

export function ToastStack({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-dealIn rounded-pill bg-gold-card px-4 py-2 text-sm font-bold text-navy shadow-glow-gold"
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}
