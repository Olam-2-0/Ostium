import React from 'react';
import { Activity, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useMindVibe } from '../../hooks/useMindVibe';

export const WorkloadCard: React.FC = () => {
  const { workload } = useMindVibe();

  const stateColors = {
    Balanced: {
      text: 'text-accentGreen',
      bg: 'bg-accentGreen/15',
      bar: 'bg-accentGreen',
      border: 'border-accentGreen/20',
      icon: CheckCircle,
    },
    Busy: {
      text: 'text-accentBlue',
      bg: 'bg-accentBlue/15',
      bar: 'bg-accentBlue',
      border: 'border-accentBlue/20',
      icon: Activity,
    },
    'High Workload': {
      text: 'text-[#B76E00]',
      bg: 'bg-accentAmber/15',
      bar: 'bg-accentAmber',
      border: 'border-accentAmber/30',
      icon: AlertTriangle,
    },
    Overloaded: {
      text: 'text-accentRose',
      bg: 'bg-accentRose/15',
      bar: 'bg-accentRose',
      border: 'border-accentRose/30',
      icon: AlertTriangle,
    },
  }[workload.state];

  const StateIcon = stateColors.icon;

  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-card flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-textPrimary tracking-tight">Today's Workload</h3>
              <p className="text-[11px] text-textSecondary">Calculated from energy & pending work</p>
            </div>
          </div>

          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${stateColors.bg} ${stateColors.text} ${stateColors.border}`}
          >
            <StateIcon className="w-3.5 h-3.5" />
            <span>{workload.state}</span>
          </div>
        </div>

        {!workload.hasCheckIn && (
          <div className="mb-3 px-3 py-2 rounded-xl bg-accentAmber/10 border border-accentAmber/20 text-xs text-[#B76E00] flex items-center gap-2">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>Save a check-in to see your workload calibrated to today's mood.</span>
          </div>
        )}

        <div className="space-y-2 mt-4">
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-medium text-textSecondary">{workload.subtitle}</span>
            <span className="font-mono font-bold text-textPrimary text-sm">
              {(workload.todayMinutes / 60).toFixed(1)}h / {workload.availableHours}h
              <span className="text-xs text-textSecondary ml-1">
                ({Math.round(workload.loadRatio * 100)}%)
              </span>
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-border/60">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${stateColors.bar}`}
              style={{ width: `${workload.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border/70 flex items-center justify-between text-[11px] text-textSecondary">
        <span>Pending tasks: {workload.todayMinutes} mins</span>
        <span>
          Ratio: <strong className="font-mono text-textPrimary">{workload.loadRatio}x</strong>
        </span>
      </div>
    </div>
  );
};
