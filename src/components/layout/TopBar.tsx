import React from 'react';
import { Plus, Sparkles, Flame } from 'lucide-react';
import { useMindVibe } from '../../hooks/useMindVibe';
import { Button } from '../common/Button';

export const TopBar: React.FC = () => {
  const { currentView, openModal, streak, demoMode, toggleDemoMode } = useMindVibe();

  const viewTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard', subtitle: 'Sync your work to your energy' },
    planner: { title: 'Academic Planner', subtitle: 'Organize assignments & schedules' },
    focus: { title: 'Focus Space', subtitle: 'Deep work intervals with drift-free tracking' },
    wellness: { title: 'Wellness & Habits', subtitle: 'Daily check-ins & habit routines' },
    insights: { title: 'Weekly Insights', subtitle: 'Reflections and adaptive guidance' },
  };

  const currentInfo = viewTitles[currentView] || {
    title: 'MindVibe',
    subtitle: 'Your pace. Your balance.',
  };

  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/60 px-4 md:px-8 py-3.5 flex items-center justify-between">
      {/* Mobile Branding / Desktop Title */}
      <div className="flex items-center gap-3">
        <div className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondaryIndigo flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base text-textPrimary">MindVibe</span>
        </div>

        <div className="hidden md:block">
          <h1 className="text-xl font-bold text-textPrimary tracking-tight">{currentInfo.title}</h1>
          <p className="text-xs text-textSecondary">{currentInfo.subtitle}</p>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Mobile Demo Toggle */}
        <button
          onClick={toggleDemoMode}
          className="md:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-card text-xs font-medium text-textPrimary shadow-subtle"
        >
          <span
            className={`w-2 h-2 rounded-full ${demoMode ? 'bg-accentGreen' : 'bg-slate-300'}`}
          />
          <span>Demo</span>
        </button>

        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accentAmber/10 border border-accentAmber/25 text-[#B76E00] text-xs font-semibold shadow-subtle">
          <Flame className="w-3.5 h-3.5 fill-[#E8A84A] text-[#E8A84A]" />
          <span>{streak}d streak</span>
        </div>

        {/* Quick Add Task */}
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => openModal('quickAddTask')}
          aria-label="Add new task"
        >
          <span className="hidden sm:inline">Add Task</span>
          <span className="sm:hidden">Task</span>
        </Button>
      </div>
    </header>
  );
};
