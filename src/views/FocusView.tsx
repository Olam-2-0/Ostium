import React from 'react';
import { FocusTimer } from '../components/focus/FocusTimer';
import { Clock } from 'lucide-react';
import { useMindVibe } from '../hooks/useMindVibe';

export const FocusView: React.FC = () => {
  const { focusSessions } = useMindVibe();

  const totalFocusMins = focusSessions.reduce((sum, s) => sum + s.durationMinutes, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/60">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-textPrimary tracking-tight">
            Focus Space
          </h2>
          <p className="text-xs text-textSecondary mt-0.5">
            Single-task deep work blocks • Timestamp drift prevention
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-semibold text-textSecondary flex items-center gap-1.5 shadow-subtle">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>{(totalFocusMins / 60).toFixed(1)}h focused all-time</span>
          </div>
        </div>
      </div>

      {/* Focus Timer Component */}
      <FocusTimer />
    </div>
  );
};
