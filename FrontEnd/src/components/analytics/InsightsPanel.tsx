import { useState } from "react";
import {
  Lightbulb,
  HelpCircle,
  Trophy,
  Brain,
  Flame,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type Insight,
  type InsightConfidence,
} from "@/types/analytics.types";

export interface InsightsPanelProps {
  insights: Insight[];
  loading?: boolean;
}

const CONFIDENCE_LABEL: Record<InsightConfidence, string> = {
  low: "Baja confianza",
  medium: "Confianza media",
  high: "Alta confianza",
};

const CONFIDENCE_CLASSES: Record<InsightConfidence, string> = {
  low: "bg-v2-line text-v2-ink-3",
  medium: "bg-v2-primary-pale text-v2-primary-deep",
  high: "bg-v2-primary text-white",
};

/** Map insight key → icon. Falls back to Lightbulb. */
const iconFor = (key: string) => {
  if (key === "best_method") return Trophy;
  if (key === "retention_quality") return Brain;
  if (key === "adherence") return Flame;
  if (key === "most_used_method") return Sparkles;
  return Lightbulb;
};

const Loading = () => (
  <section className="mb-6">
    <div className="flex items-center gap-2 mb-3">
      <Lightbulb size={14} className="text-v2-primary-deep" />
      <span className="font-v2-mono text-[11px] tracking-[1.5px] uppercase text-v2-primary-deep font-medium">
        Insights
      </span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="bg-v2-surface border border-v2-line rounded-v2-lg p-5 animate-pulse"
        >
          <div className="h-3 w-1/4 bg-v2-line rounded mb-3" />
          <div className="h-5 w-3/4 bg-v2-line rounded mb-2" />
          <div className="h-3 w-1/2 bg-v2-line rounded" />
        </div>
      ))}
    </div>
  </section>
);

const InsightCard = ({ insight }: { insight: Insight }) => {
  const [open, setOpen] = useState(false);
  const Icon = iconFor(insight.key);

  return (
    <div className="bg-v2-surface border border-v2-line rounded-v2-lg p-5 relative">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-md bg-v2-primary-pale text-v2-primary-deep flex items-center justify-center">
          <Icon size={14} />
        </div>
        <span
          className={cn(
            "font-v2-mono text-[10px] tracking-[1.2px] uppercase font-medium px-2 py-0.5 rounded-full",
            CONFIDENCE_CLASSES[insight.confidence]
          )}
        >
          {CONFIDENCE_LABEL[insight.confidence]}
        </span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="¿Cómo se calcula este insight?"
          className="ml-auto inline-flex items-center justify-center w-7 h-7 rounded-md text-v2-ink-3 hover:text-v2-ink hover:bg-black/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v2-primary/30"
        >
          <HelpCircle size={15} />
        </button>
      </div>

      <h3 className="text-[16px] font-medium m-0 mb-1.5 text-v2-ink leading-[1.3]">
        {insight.headline}
      </h3>
      <p className="text-[13.5px] text-v2-ink-2 m-0 leading-[1.5]">
        {insight.detail}
      </p>

      {open && (
        <div className="mt-3 p-3 rounded-v2-sm bg-v2-bg border border-v2-line">
          <div className="font-v2-mono text-[10px] tracking-[1.2px] uppercase text-v2-ink-3 font-medium mb-1.5">
            ¿Cómo se calcula?
          </div>
          <p className="text-[12px] text-v2-ink-2 m-0 leading-[1.55]">
            {insight.computation}
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * Top-of-page panel rendering 0–4 plain-Spanish insight cards. Designed
 * to address RQ4 (trust in metrics) by leading with narrative, not raw
 * charts, and by letting the user open a "¿Cómo se calcula?" explanation
 * per card.
 *
 * If the backend emits zero insights (no data, or thresholds not met),
 * the section renders nothing — better than fabricating insights.
 */
export const InsightsPanel = ({ insights, loading }: InsightsPanelProps) => {
  if (loading) return <Loading />;
  if (!insights || insights.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb size={14} className="text-v2-primary-deep" />
        <span className="font-v2-mono text-[11px] tracking-[1.5px] uppercase text-v2-primary-deep font-medium">
          Insights
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight) => (
          <InsightCard key={insight.key} insight={insight} />
        ))}
      </div>
    </section>
  );
};
