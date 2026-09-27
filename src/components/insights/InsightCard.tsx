import React from 'react';
import { Brain } from 'lucide-react';

interface InsightCardProps {
  insightText: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insightText }) => {
  return (
    <div className="bg-gradient-to-br from-primary/10 via-secondaryIndigo/10 to-transparent rounded-2xl border border-primary/20 p-5 shadow-card relative overflow-hidden">
      <div className="flex items-start gap-3.5 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-card shadow-primary/25 shrink-0">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              AI Weekly Synthesis
            </span>
            <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-semibold">
              Deterministic Rules
            </span>
          </div>
          <p className="text-sm font-semibold text-textPrimary leading-relaxed">
            "{insightText}"
          </p>
          <p className="text-[11px] text-textSecondary mt-2">
            MindVibe updates recommendations dynamically based on your check-in history and task adjustments.
          </p>
        </div>
      </div>
    </div>
  );
};
