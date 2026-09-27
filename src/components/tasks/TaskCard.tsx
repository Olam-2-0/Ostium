import React, { useState } from 'react';
import {
  Check,
  Clock,
  Calendar,
  MoreHorizontal,
  Edit2,
  Trash2,
  Sparkles,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { Task } from '../../types';
import { PriorityBadge } from '../common/Badge';
import { formatShortDate, isToday } from '../../utils/dateUtils';
import { useMindVibe } from '../../hooks/useMindVibe';

interface TaskCardProps {
  task: Task;
  compact?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, compact = false }) => {
  const { completeTask, deleteTask, openModal, updateTask } = useMindVibe();
  const [menuOpen, setMenuOpen] = useState(false);
  const [subtasksOpen, setSubtasksOpen] = useState(false);

  const isDueToday = isToday(task.dueDate);
  const isOverdue = !task.completed && task.dueDate < (new Date().toISOString().split('T')[0]);

  const toggleSubtask = (stId: string) => {
    const updated = task.subtasks.map((st) =>
      st.id === stId ? { ...st, completed: !st.completed } : st
    );
    updateTask(task.id, { subtasks: updated });
  };

  return (
    <div
      className={`group relative bg-card rounded-2xl border border-border transition-all duration-200 hover:shadow-card hover:border-slate-300 ${
        task.completed ? 'opacity-65 bg-slate-50/50' : ''
      } ${compact ? 'p-3.5' : 'p-4 sm:p-5'}`}
    >
      <div className="flex items-start gap-3">
        {/* Completion Checkbox */}
        <button
          onClick={() => completeTask(task.id)}
          disabled={task.completed}
          aria-label={task.completed ? 'Task completed' : `Mark ${task.title} complete`}
          className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
            task.completed
              ? 'bg-accentGreen border-accentGreen text-white cursor-default'
              : 'border-slate-300 hover:border-primary hover:bg-primary/5 active:scale-90'
          }`}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <PriorityBadge priority={task.priority} />
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-black/5 text-textSecondary">
              {task.subject}
            </span>
            {task.rescheduledFrom && (
              <span className="text-[10px] text-accentAmber font-medium flex items-center gap-1">
                <RotateCcw className="w-2.5 h-2.5" />
                Rescheduled
              </span>
            )}
            {task.splitFromId && (
              <span className="text-[10px] text-secondaryIndigo font-medium">
                Part of split
              </span>
            )}
          </div>

          <h4
            className={`text-sm font-semibold tracking-tight leading-snug break-normal ${
              task.completed ? 'line-through text-textSecondary' : 'text-textPrimary'
            }`}
          >
            {task.title}
          </h4>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-textSecondary">
            <span
              className={`flex items-center gap-1 font-medium ${
                isOverdue
                  ? 'text-accentRose'
                  : isDueToday
                  ? 'text-primary'
                  : 'text-textSecondary'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              {isDueToday ? 'Today' : formatShortDate(task.dueDate)}
            </span>

            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {task.durationMinutes}m
            </span>

            {task.scheduledTime && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-[11px] font-semibold">
                🕒 {task.scheduledTime}
              </span>
            )}

            {task.subtasks.length > 0 && (
              <button
                onClick={() => setSubtasksOpen(!subtasksOpen)}
                className="flex items-center gap-1 text-primary hover:underline font-medium text-[11px]"
              >
                <span>
                  {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} subtasks
                </span>
                {subtasksOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>

          {/* Subtasks dropdown */}
          {subtasksOpen && task.subtasks.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/70 space-y-1.5">
              {task.subtasks.map((st) => (
                <div key={st.id} className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={st.completed}
                    onChange={() => toggleSubtask(st.id)}
                    className="w-3.5 h-3.5 rounded text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                  />
                  <span
                    className={`flex-1 ${
                      st.completed ? 'line-through text-textSecondary' : 'text-textPrimary'
                    }`}
                  >
                    {st.title}
                  </span>
                  <span className="text-[10px] text-textSecondary">{st.estimatedMinutes}m</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {!task.completed && (
            <button
              onClick={() => openModal('reschedule', task.id)}
              title="Reschedule / Didn't Complete"
              className="p-1.5 rounded-lg text-textSecondary hover:text-accentAmber hover:bg-accentAmber/10 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Task options"
              className="p-1.5 rounded-lg text-textSecondary hover:text-textPrimary hover:bg-black/5 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-30 w-44 bg-card rounded-xl border border-border shadow-elevated py-1.5 text-xs animate-fade-in">
                  {!task.completed && (
                    <>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          openModal('taskBreakdown', task.id);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-textPrimary hover:bg-black/5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-secondaryIndigo" />
                        <span>Break Down with AI</span>
                      </button>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          openModal('reschedule', task.id);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-textPrimary hover:bg-black/5"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-accentAmber" />
                        <span>Didn't Complete</span>
                      </button>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          openModal('editTask', task.id);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-textPrimary hover:bg-black/5"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-textSecondary" />
                        <span>Edit Task</span>
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      deleteTask(task.id);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-accentRose hover:bg-accentRose/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Task</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
