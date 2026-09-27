import React, { useState, useMemo } from 'react';
import { useMindVibe } from '../hooks/useMindVibe';
import { WeekView } from '../components/planner/WeekView';
import { CalendarView } from '../components/planner/CalendarView';
import { TaskList } from '../components/tasks/TaskList';
import { isToday, todayISO } from '../utils/dateUtils';
import { Calendar, CalendarDays, ListOrdered, Plus, AlertCircle } from 'lucide-react';
import { Button } from '../components/common/Button';

type PlannerTab = 'today' | 'week' | 'calendar';

export const PlannerView: React.FC = () => {
  const { tasks, openModal, getOverdueTasks } = useMindVibe();
  const [activeTab, setActiveTab] = useState<PlannerTab>('today');

  const today = todayISO();
  const overdueTasks = getOverdueTasks();
  const todayTasks = useMemo(() => {
    return tasks.filter((t) => isToday(t.dueDate));
  }, [tasks]);

  const upcomingTasks = useMemo(() => {
    return tasks.filter((t) => t.dueDate > today);
  }, [tasks, today]);

  return (
    <div className="space-y-6">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-textPrimary tracking-tight">
            Academic Schedule & Assignments
          </h2>
          <p className="text-xs text-textSecondary mt-0.5">
            Organize coursework across today, the week, or the monthly calendar.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-card border border-border shadow-subtle">
            <button
              onClick={() => setActiveTab('today')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'today'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Today</span>
            </button>

            <button
              onClick={() => setActiveTab('week')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'week'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Week</span>
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'calendar'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => openModal('quickAddTask')}
          >
            Add Task
          </Button>
        </div>
      </div>

      {/* Tab 1: Today */}
      {activeTab === 'today' && (
        <div className="space-y-6 animate-fade-in">
          {/* Overdue Section (if any) */}
          {overdueTasks.length > 0 && (
            <div className="bg-card rounded-2xl border border-accentRose/30 p-5 shadow-card bg-accentRose/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-accentRose/20 text-accentRose flex items-center justify-center">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-accentRose">Overdue Assignments</h3>
                    <p className="text-xs text-textSecondary">
                      Past due dates ({overdueTasks.length} items) • Consider rescheduling
                    </p>
                  </div>
                </div>
              </div>

              <TaskList tasks={overdueTasks} />
            </div>
          )}

          {/* Today's Tasks */}
          <div className="bg-card rounded-2xl border border-border p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-textPrimary tracking-tight">Today's Schedule</h3>
                <p className="text-xs text-textSecondary">
                  {todayTasks.length} task{todayTasks.length === 1 ? '' : 's'} scheduled for today
                </p>
              </div>
            </div>

            <TaskList
              tasks={todayTasks}
              emptyTitle="No tasks scheduled for today 🎉"
              emptyDescription="You have completed all items or have a free day ahead."
              emptyAction={
                <Button variant="secondary" size="sm" onClick={() => openModal('quickAddTask')}>
                  Add assignment
                </Button>
              }
            />
          </div>

          {/* Upcoming Assignments */}
          {upcomingTasks.length > 0 && (
            <div className="bg-card rounded-2xl border border-border p-5 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-textPrimary tracking-tight">
                    Upcoming Assignments (Next 7 Days)
                  </h3>
                  <p className="text-xs text-textSecondary">
                    Plan ahead and reschedule workload before deadlines hit ({upcomingTasks.length} upcoming)
                  </p>
                </div>
              </div>

              <TaskList tasks={upcomingTasks} />
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Week */}
      {activeTab === 'week' && (
        <div className="animate-fade-in">
          <WeekView tasks={tasks} />
        </div>
      )}

      {/* Tab 3: Calendar */}
      {activeTab === 'calendar' && (
        <div className="animate-fade-in">
          <CalendarView tasks={tasks} />
        </div>
      )}
    </div>
  );
};
