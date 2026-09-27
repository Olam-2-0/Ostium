import React, { useMemo } from 'react';
import { useMindVibe } from '../hooks/useMindVibe';
import { getGreeting, formatFullDate, todayISO } from '../utils/dateUtils';
import { DailyCheckInCard } from '../components/dashboard/DailyCheckInCard';
import { WorkloadCard } from '../components/dashboard/WorkloadCard';
import { DailyPlanCard } from '../components/dashboard/DailyPlanCard';
import { TaskList } from '../components/tasks/TaskList';
import { ProgressRing } from '../components/common/ProgressRing';
import { Flame, Calendar, Plus } from 'lucide-react';
import { Button } from '../components/common/Button';

export const DashboardView: React.FC = () => {
  const { profile, tasks, streak, openModal } = useMindVibe();

  const today = todayISO();
  const { greeting } = getGreeting(profile.name || 'there');
  const fullDate = formatFullDate(today);

  // Today's Priority Tasks: pending tasks where dueDate <= today, sorted High > Medium > Low, then earliest dueDate
  const priorityTasks = useMemo(() => {
    const priorityWeights = { High: 0, Medium: 1, Low: 2 };
    return tasks
      .filter((t) => !t.completed && t.dueDate <= today)
      .sort((a, b) => {
        if (priorityWeights[a.priority] !== priorityWeights[b.priority]) {
          return priorityWeights[a.priority] - priorityWeights[b.priority];
        }
        return a.dueDate.localeCompare(b.dueDate);
      });
  }, [tasks, today]);

  // Today's Progress calculation
  const { progressPercent, completedTodayCount, totalTodayCount } = useMemo(() => {
    const todayAllTasks = tasks.filter((t) => t.dueDate <= today);
    const completedCount = todayAllTasks.filter((t) => t.completed).length;
    const totalCount = todayAllTasks.length;
    const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    return {
      progressPercent: pct,
      completedTodayCount: completedCount,
      totalTodayCount: totalCount,
    };
  }, [tasks, today]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-textPrimary tracking-tight">
            {greeting}
          </h1>
          <p className="text-xs sm:text-sm text-textSecondary mt-0.5">
            Let's make today manageable.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-semibold text-textSecondary shadow-subtle">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>{fullDate}</span>
          </div>
        </div>
      </div>

      {/* Row 1: Daily Check-In & Workload Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailyCheckInCard />
        <WorkloadCard />
      </div>

      {/* Row 2: Today's AI Schedule */}
      <DailyPlanCard />

      {/* Row 3: Today's Priority Tasks & Daily Progress Ring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Tasks (2 columns on large) */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-textPrimary tracking-tight">
                Today's Priority Tasks
              </h3>
              <p className="text-xs text-textSecondary">
                Sorted by High Priority & due date ({priorityTasks.length} pending)
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => openModal('quickAddTask')}
            >
              Add Task
            </Button>
          </div>

          <TaskList
            tasks={priorityTasks}
            emptyTitle="Nothing urgent today 🎉"
            emptyDescription="All today's tasks are completed or rescheduled. You're in great shape."
            emptyAction={
              <Button variant="secondary" size="sm" onClick={() => openModal('quickAddTask')}>
                Add a task
              </Button>
            }
          />
        </div>

        {/* Daily Progress & Streak Ring */}
        <div className="bg-card rounded-2xl border border-border p-5 shadow-card flex flex-col items-center justify-between text-center">
          <div className="w-full text-left">
            <h3 className="text-sm font-bold text-textPrimary tracking-tight">Daily Progress</h3>
            <p className="text-xs text-textSecondary">Tasks completed today</p>
          </div>

          <div className="my-6">
            <ProgressRing
              progress={progressPercent}
              size={140}
              strokeWidth={12}
              strokeColor="#6366F1"
            >
              <div className="flex flex-col items-center">
                <span className="font-mono text-3xl font-extrabold text-textPrimary">
                  {progressPercent}%
                </span>
                <span className="text-[11px] text-textSecondary font-semibold">
                  {completedTodayCount} of {totalTodayCount}
                </span>
              </div>
            </ProgressRing>
          </div>

          <div className="w-full pt-4 border-t border-border/80 flex items-center justify-between text-xs">
            <span className="text-textSecondary flex items-center gap-1 font-semibold">
              <Flame className="w-4 h-4 fill-[#E8A84A] text-[#E8A84A]" />
              Active Streak
            </span>
            <span className="font-bold text-[#B76E00]">{streak} days</span>
          </div>
        </div>
      </div>
    </div>
  );
};
