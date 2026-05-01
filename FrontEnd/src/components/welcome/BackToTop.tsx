import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const SCROLL_THRESHOLD = 300;

/**
 * Floating "scroll back to top" button.
 * Lifts the behaviour from the original Home.tsx and restyles with V2
 * tokens. Uses passive scroll listener; `useState` ignores deltas inside
 * the threshold so we don't re-render on every scroll tick.
 */
export const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > SCROLL_THRESHOLD;
      setVisible((prev) => (prev === next ? prev : next));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Volver al inicio"
      className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-v2-surface border border-v2-line text-v2-ink-2 hover:text-v2-primary-deep hover:border-v2-primary-soft shadow-v2-md flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 z-50"
    >
      <ArrowUp size={20} />
    </button>
  );
};
