import React from 'react';
import type { WeeklyMetrics } from '../../types';

interface MetricChartsProps {
  metrics: WeeklyMetrics;
}

export const MetricCharts: React.FC<MetricChartsProps> = ({ metrics }) => {
  // Chart 1: Tasks completed by day
  const maxTasks = Math.max(1, ...metrics.tasksByDay.map((d) => d.total));

  // Chart 2: Focus time by day
  const maxFocus = Math.max(30, ...metrics.focusByDay.map((d) => d.minutes));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: Tasks Completed by Day */}
        <div className="bg-card rounded-2xl border border-border p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-textPrimary tracking-tight">
                Tasks Completed by Day
              </h3>
              <p className="text-xs text-textSecondary">Completed vs total assigned (7 days)</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-textSecondary">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-primary" /> Completed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-200" /> Total
              </span>
            </div>
          </div>

          <div className="h-48 flex items-end justify-between gap-2 pt-6">
            {metrics.tasksByDay.map((d) => {
              const totalHeight = (d.total / maxTasks) * 100;
              const completedHeight = d.total > 0 ? (d.completed / d.total) * 100 : 0;

              return (
                <div key={d.date} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="relative w-full max-w-[28px] h-36 flex items-end justify-center">
                    {/* Background bar (total) */}
                    <div
                      className="w-full bg-slate-100 rounded-lg relative overflow-hidden flex items-end border border-border/40"
                      style={{ height: `${Math.max(totalHeight, 8)}%` }}
                    >
                      {/* Completed fill */}
                      <div
                        className="w-full bg-primary rounded-b-lg transition-all duration-500 ease-out"
                        style={{ height: `${completedHeight}%` }}
                      />
                    </div>

                    {/* Tooltip */}
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-textPrimary text-white text-[10px] py-0.5 px-1.5 rounded pointer-events-none whitespace-nowrap z-10">
                      {d.completed}/{d.total} done
                    </div>
                  </div>

                  <span className="text-[11px] font-medium text-textSecondary mt-2">
                    {d.dayLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHART 2: Focus Time by Day */}
        <div className="bg-card rounded-2xl border border-border p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-textPrimary tracking-tight">
                Focus Time by Day
              </h3>
              <p className="text-xs text-textSecondary">Deep work duration in minutes (7 days)</p>
            </div>
            <span className="text-xs font-mono font-bold text-secondaryIndigo">
              {metrics.focusHours}h total
            </span>
          </div>

          <div className="h-48 flex items-end justify-between gap-2 pt-6">
            {metrics.focusByDay.map((d) => {
              const barHeight = (d.minutes / maxFocus) * 100;

              return (
                <div key={d.date} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="relative w-full max-w-[28px] h-36 flex items-end justify-center">
                    <div
                      className="w-full bg-gradient-to-t from-secondaryIndigo to-primary rounded-lg transition-all duration-500 ease-out shadow-xs"
                      style={{ height: `${Math.max(barHeight, d.minutes > 0 ? 8 : 4)}%` }}
                    />
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-textPrimary text-white text-[10px] py-0.5 px-1.5 rounded pointer-events-none whitespace-nowrap z-10">
                      {d.minutes}m
                    </div>
                  </div>

                  <span className="text-[11px] font-medium text-textSecondary mt-2">
                    {d.dayLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CHART 3: Workload vs Energy */}
      <div className="bg-card rounded-2xl border border-border p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-textPrimary tracking-tight">
              Workload vs Energy Level
            </h3>
            <p className="text-xs text-textSecondary">
              Workload (0: Balanced, 3: Overloaded) vs Energy (1: Low, 3: High)
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-textSecondary">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-accentAmber" /> Workload Demand
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-accentGreen" /> Capacity / Energy
            </span>
          </div>
        </div>

        <div className="h-48 flex items-end justify-between gap-3 pt-6 border-b border-border/80 pb-2">
          {metrics.workloadVsEnergy.map((d) => {
            // Workload: 0..3 -> height 10% to 100%
            const workloadHeight = Math.max(10, (d.workloadScore / 3) * 100);
            // Energy: 1..3 -> height 25% to 100%
            const energyHeight = (d.energyScore / 3) * 100;

            return (
              <div key={d.date} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="relative w-full max-w-[48px] h-36 flex items-end justify-center gap-1.5">
                  {/* Workload Bar */}
                  <div
                    className="w-1/2 bg-accentAmber/80 hover:bg-accentAmber rounded-t-md transition-all duration-300"
                    style={{ height: `${workloadHeight}%` }}
                    title={`Workload score: ${d.workloadScore}`}
                  />
                  {/* Energy Bar */}
                  <div
                    className="w-1/2 bg-accentGreen/80 hover:bg-accentGreen rounded-t-md transition-all duration-300"
                    style={{ height: `${energyHeight}%` }}
                    title={`Energy score: ${d.energyScore}`}
                  />

                  {/* Tooltip */}
                  <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-textPrimary text-white text-[10px] py-0.5 px-1.5 rounded pointer-events-none whitespace-nowrap z-10">
                    W: {d.workloadScore} / E: {d.energyScore}
                  </div>
                </div>

                <span className="text-[11px] font-medium text-textSecondary mt-2">
                  {d.dayLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
