import React from 'react';
import { useMindVibe } from '../hooks/useMindVibe';
import { InsightCard } from '../components/insights/InsightCard';
import { MetricCharts } from '../components/insights/MetricCharts';
import { CheckCircle2, Clock, Smile, Flame, TrendingUp } from 'lucide-react';

export const InsightsView: React.FC = () => {
  const { getWeeklyMetrics } = useMindVibe();

  const metrics = getWeeklyMetrics();

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/60">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-textPrimary tracking-tight">
            Weekly Insights & Analytics
          </h2>
          <p className="text-xs text-textSecondary mt-0.5">
            Reflecting on your last 7 days of focus, assignments, and energy
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-semibold text-textSecondary shadow-subtle">
          <TrendingUp className="w-3.5 h-3.5 text-primary" />
          <span>Last 7 Days</span>
        </div>
      </div>

      {/* Top AI Insight Recommendation */}
      <InsightCard insightText={metrics.weeklyInsight} />

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Tasks Completed Rate */}
        <div className="bg-card rounded-2xl border border-border p-4 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-textSecondary">Task Success Rate</span>
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-mono text-2xl font-extrabold text-textPrimary">
              {Math.round(metrics.tasksCompletedRate * 100)}%
            </span>
            <p className="text-[11px] text-textSecondary mt-0.5 font-medium">
              {metrics.completedCount} of {metrics.totalCount} completed
            </p>
          </div>
        </div>

        {/* Stat 2: Focus Hours */}
        <div className="bg-card rounded-2xl border border-border p-4 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-textSecondary">Total Deep Work</span>
            <div className="p-1.5 rounded-lg bg-secondaryIndigo/10 text-secondaryIndigo">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-mono text-2xl font-extrabold text-textPrimary">
              {metrics.focusHours}h
            </span>
            <p className="text-[11px] text-textSecondary mt-0.5 font-medium">
              Over the last 7 days
            </p>
          </div>
        </div>

        {/* Stat 3: Average Mood */}
        <div className="bg-card rounded-2xl border border-border p-4 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-textSecondary">Average Mood Score</span>
            <div className="p-1.5 rounded-lg bg-accentGreen/10 text-accentGreen">
              <Smile className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-mono text-2xl font-extrabold text-textPrimary">
              {metrics.averageMood > 0 ? `${metrics.averageMood} / 4.0` : 'N/A'}
            </span>
            <p className="text-[11px] text-textSecondary mt-0.5 font-medium">
              {metrics.averageMood >= 3.5 ? '😊 High vitality' : metrics.averageMood >= 2.5 ? '😐 Stable balance' : '😓 Needs more breaks'}
            </p>
          </div>
        </div>

        {/* Stat 4: Current Streak */}
        <div className="bg-card rounded-2xl border border-border p-4 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-textSecondary">Current Habit Streak</span>
            <div className="p-1.5 rounded-lg bg-accentAmber/10 text-accentAmber">
              <Flame className="w-4 h-4 fill-current" />
            </div>
          </div>
          <div>
            <span className="font-mono text-2xl font-extrabold text-textPrimary">
              {metrics.currentStreak} days
            </span>
            <p className="text-[11px] text-textSecondary mt-0.5 font-medium">
              Tasks & habits combined
            </p>
          </div>
        </div>
      </div>

      {/* SVG Metric Charts */}
      <MetricCharts metrics={metrics} />
    </div>
  );
};
