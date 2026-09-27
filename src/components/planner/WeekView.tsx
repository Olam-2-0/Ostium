import React from 'react';
import type { Task } from '../../types';
import { addDays, isSameDay, todayISO, parseISODate } from '../../utils/dateUtils';
import { TaskCard } from '../tasks/TaskCard';
import { Plus } from 'lucide-react';
import { useMindVibe } from '../../hooks/useMindVibe';

interface WeekViewProps {
  tasks: Task[];
}

export const WeekView: React.FC<WeekViewProps> = ({ tasks }) => {
  const { openModal } = useMindVibe();
  const today = todayISO();

  // Calculate Monday–Sunday of current week
  const todayDate = parseISODate(today);
  const dayOfWeek = todayDate.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const mondayStr = addDays(today, diffToMonday);

  // 7 days: Monday to Sunday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(mondayStr, i));

  return (
    <div className="flex flex-col space-y-3.5 pb-4">
      {weekDays.map((dayStr) => {
        const d = parseISODate(dayStr);
        const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
        const shortDay = d.toLocaleDateString('en-US', { weekday: 'short' });
        const dayNumber = d.getDate();
        const monthName = d.toLocaleDateString('en-US', { month: 'short' });
        const isCurrentDay = isSameDay(dayStr, today);

        const dayTasks = tasks.filter((t) => isSameDay(t.dueDate, dayStr));

        return (
          <div
            key={dayStr}
            className={`rounded-2xl border transition-all p-4 ${
              isCurrentDay
                ? 'bg-card border-primary/40 shadow-card ring-1 ring-primary/20'
                : 'bg-card/90 border-border shadow-subtle'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              {/* Day Header (Left Column on sm+) */}
              <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-2 sm:w-36 shrink-0 pb-2 sm:pb-0 border-b sm:border-b-0 sm:border-r border-border/80 sm:pr-4">
                <div>
                  <p className="text-xs font-bold text-textSecondary uppercase tracking-wider">
                    <span className="hidden sm:inline">{dayName}</span>
                    <span className="sm:hidden">{shortDay}</span>
                  </p>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span
                      className={`text-xl font-extrabold ${
                        isCurrentDay ? 'text-primary' : 'text-textPrimary'
                      }`}
                    >
                      {dayNumber}
                    </span>
                    <span className="text-xs text-textSecondary font-semibold">{monthName}</span>
                  </div>
                </div>

                {isCurrentDay && (
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                    Today
                  </span>
                )}

                <button
                  onClick={() => openModal('quickAddTask')}
                  className="hidden sm:inline-flex items-center gap-1 mt-2.5 px-2.5 py-1 rounded-lg border border-dashed border-border text-textSecondary hover:text-primary hover:border-primary/40 hover:bg-primary/5 text-xs font-medium transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* Tasks List (Right side with horizontal cards) */}
              <div className="flex-1 min-w-0">
                {dayTasks.length === 0 ? (
                  <div className="py-3 px-4 flex items-center justify-between text-xs text-textSecondary border border-dashed border-border/70 rounded-xl bg-background/50">
                    <span>No assignments scheduled</span>
                    <button
                      onClick={() => openModal('quickAddTask')}
                      className="sm:hidden text-primary font-semibold text-xs flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {dayTasks.map((task) => (
                      <TaskCard key={task.id} task={task} compact />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
