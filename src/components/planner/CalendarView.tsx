import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Task, Priority } from '../../types';
import { isSameDay, todayISO, toISODateString, formatDate } from '../../utils/dateUtils';
import { TaskList } from '../tasks/TaskList';
import { Button } from '../common/Button';
import { useMindVibe } from '../../hooks/useMindVibe';

interface CalendarViewProps {
  tasks: Task[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
  const { openModal } = useMindVibe();

  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [selectedDayStr, setSelectedDayStr] = useState<string>(todayISO());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const resetToToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDayStr(todayISO());
  };

  // Build grid of days
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays: { dateStr: string; dayNumber: number; isCurrentMonth: boolean }[] = [];

  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, daysInPrevMonth - i);
    calendarDays.push({
      dateStr: toISODateString(d),
      dayNumber: d.getDate(),
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    calendarDays.push({
      dateStr: toISODateString(dateObj),
      dayNumber: d,
      isCurrentMonth: true,
    });
  }

  // Next month leading days to complete grid (multiples of 7)
  const remainingCells = 42 - calendarDays.length;
  for (let d = 1; d <= remainingCells; d++) {
    const dateObj = new Date(year, month + 1, d);
    calendarDays.push({
      dateStr: toISODateString(dateObj),
      dayNumber: d,
      isCurrentMonth: false,
    });
  }

  // Priority dot colors
  const dotColorClass = (priority: Priority) => {
    if (priority === 'High') return 'bg-accentRose';
    if (priority === 'Medium') return 'bg-accentAmber';
    return 'bg-primary';
  };

  const selectedDayTasks = tasks.filter((t) => isSameDay(t.dueDate, selectedDayStr));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar Grid (2 cols on large screen) */}
      <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-5 shadow-card">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-textPrimary tracking-tight">{monthName}</h3>
            <button
              onClick={resetToToday}
              className="px-2.5 py-1 rounded-lg bg-background hover:bg-black/5 border border-border text-xs font-semibold text-textSecondary"
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              aria-label="Previous month"
              className="p-1.5 rounded-lg text-textSecondary hover:text-textPrimary hover:bg-black/5"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextMonth}
              aria-label="Next month"
              className="p-1.5 rounded-lg text-textSecondary hover:text-textPrimary hover:bg-black/5"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-textSecondary py-2 border-b border-border/80">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar days cells */}
        <div className="grid grid-cols-7 gap-1 mt-2">
          {calendarDays.map((cell) => {
            const isTodayCell = isSameDay(cell.dateStr, todayISO());
            const isSelected = isSameDay(cell.dateStr, selectedDayStr);

            const cellTasks = tasks.filter((t) => isSameDay(t.dueDate, cell.dateStr));
            const visibleDots = cellTasks.slice(0, 3);
            const extraCount = cellTasks.length - 3;

            return (
              <button
                key={cell.dateStr}
                onClick={() => setSelectedDayStr(cell.dateStr)}
                className={`min-h-[72px] sm:min-h-[84px] p-1.5 rounded-xl border flex flex-col justify-between text-left transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : isTodayCell
                    ? 'border-primary/40 bg-card font-bold'
                    : 'border-border/60 bg-card/60 hover:bg-card hover:border-slate-300'
                } ${!cell.isCurrentMonth ? 'opacity-40' : ''}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs font-semibold w-6 h-6 rounded-full flex items-center justify-center ${
                      isTodayCell
                        ? 'bg-primary text-white shadow-xs'
                        : isSelected
                        ? 'text-primary font-bold'
                        : 'text-textPrimary'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>

                  {cellTasks.length > 0 && (
                    <span className="text-[10px] font-mono font-semibold text-textSecondary hidden sm:inline">
                      {cellTasks.length}
                    </span>
                  )}
                </div>

                {/* Priority dots: max 3 + extra count */}
                <div className="flex items-center gap-1 mt-1 flex-wrap">
                  {visibleDots.map((t) => (
                    <span
                      key={t.id}
                      className={`w-2 h-2 rounded-full ${dotColorClass(t.priority)}`}
                      title={`${t.title} (${t.priority})`}
                    />
                  ))}
                  {extraCount > 0 && (
                    <span className="text-[10px] font-mono text-textSecondary font-semibold">
                      +{extraCount}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Side Panel */}
      <div className="bg-card rounded-2xl border border-border p-5 shadow-card flex flex-col">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/80">
          <div>
            <h4 className="text-sm font-bold text-textPrimary tracking-tight">
              {formatDate(selectedDayStr)}
            </h4>
            <p className="text-xs text-textSecondary">
              {selectedDayTasks.length} assignment{selectedDayTasks.length === 1 ? '' : 's'} scheduled
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openModal('quickAddTask')}
          >
            + Add
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto max-h-[460px]">
          <TaskList
            tasks={selectedDayTasks}
            emptyTitle="No tasks scheduled for this day."
            emptyDescription="You're all clear! Enjoy the breathing room or schedule ahead."
            compact
          />
        </div>
      </div>
    </div>
  );
};
