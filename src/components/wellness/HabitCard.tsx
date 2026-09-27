import React from 'react';
import { Check, Flame } from 'lucide-react';
import type { Habit } from '../../types';
import { isSameDay, todayISO } from '../../utils/dateUtils';
import { useMindVibe } from '../../hooks/useMindVibe';

interface HabitCardProps {
  habit: Habit;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit }) => {
  const { completeHabit } = useMindVibe();
  const today = todayISO();
  const isDoneToday = habit.completedToday || isSameDay(habit.lastCompletedDate || '', today);

  return (
    <div className="bg-card rounded-2xl border border-border p-4 shadow-subtle hover:shadow-card transition-all flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="text-2xl p-2 rounded-xl bg-background border border-border select-none">
          {habit.emoji}
        </span>
        <div>
          <h4 className="text-sm font-bold text-textPrimary tracking-tight">{habit.title}</h4>
          <div className="flex items-center gap-1.5 mt-0.5 text-xs text-textSecondary font-semibold">
            <Flame className="w-3.5 h-3.5 fill-[#E8A84A] text-[#E8A84A]" />
            <span>{habit.streak} day streak</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => completeHabit(habit.id)}
        disabled={isDoneToday}
        className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
          isDoneToday
            ? 'bg-accentGreen/15 text-accentGreen border border-accentGreen/30 cursor-default'
            : 'bg-primary hover:bg-primary-hover text-white shadow-sm active:scale-95 cursor-pointer'
        }`}
      >
        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>{isDoneToday ? 'Done today ✓' : 'Complete'}</span>
      </button>
    </div>
  );
};
