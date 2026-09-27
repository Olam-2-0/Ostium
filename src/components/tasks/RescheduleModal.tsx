import React, { useState } from 'react';
import { Calendar, Split, ArrowDownRight, Clock, Check } from 'lucide-react';
import { useMindVibe } from '../../hooks/useMindVibe';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { addDays, todayISO, formatShortDate } from '../../utils/dateUtils';
import type { Priority } from '../../types';

export const RescheduleModal: React.FC = () => {
  const { uiState, closeModal, tasks, rescheduleTask } = useMindVibe();

  const taskId = uiState.rescheduleTaskId;
  const task = tasks.find((t) => t.id === taskId);

  const [selectedOption, setSelectedOption] = useState<'tomorrow' | 'split' | 'deferLower' | 'custom'>('tomorrow');
  const [customDate, setCustomDate] = useState(addDays(todayISO(), 1));
  const [customTime, setCustomTime] = useState('09:00');

  const isOpen = uiState.activeModal === 'reschedule' && !!task;

  if (!task) return null;

  const tomorrow = addDays(todayISO(), 1);
  const canSplit = task.durationMinutes > 40;

  // Check Option 3 candidate
  const priorityWeights: Record<Priority, number> = { Low: 1, Medium: 2, High: 3 };
  const todayTasks = tasks.filter((t) => !t.completed && t.dueDate <= todayISO());
  let lowestPriorityCandidate = todayTasks.length > 0 ? todayTasks[0] : null;
  for (const t of todayTasks) {
    if (lowestPriorityCandidate && priorityWeights[t.priority] < priorityWeights[lowestPriorityCandidate.priority]) {
      lowestPriorityCandidate = t;
    }
  }
  const canDeferLower = !!lowestPriorityCandidate;

  const handleApply = () => {
    if (!task) return;
    if (selectedOption === 'custom') {
      rescheduleTask(task.id, 'custom', { date: customDate, time: customTime });
    } else {
      rescheduleTask(task.id, selectedOption);
    }
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title="No worries. Let's adjust."
      subtitle={`Adjust schedule for "${task.title}" (${task.durationMinutes}m)`}
    >
      <div className="space-y-4">
        <p className="text-xs text-textSecondary">
          Things don't always go according to plan. Select an AI recommendation to relieve today's pressure without losing track of your goals.
        </p>

        {/* 3 AI Recommendations */}
        <div className="space-y-2.5">
          {/* OPTION 1 */}
          <div
            onClick={() => setSelectedOption('tomorrow')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
              selectedOption === 'tomorrow'
                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                : 'border-border bg-card hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-xl shrink-0 ${
                  selectedOption === 'tomorrow' ? 'bg-primary text-white' : 'bg-black/5 text-textSecondary'
                }`}
              >
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-textPrimary">Move to tomorrow morning</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-background border border-border text-textSecondary">
                    09:00 AM
                  </span>
                </div>
                <p className="text-[11px] text-textSecondary mt-0.5">
                  Shifts deadline to tomorrow ({formatShortDate(tomorrow)}) and slots it for 09:00 AM when your energy resets.
                </p>
              </div>
            </div>
          </div>

          {/* OPTION 2 */}
          <div
            onClick={() => {
              if (canSplit) setSelectedOption('split');
            }}
            className={`p-3.5 rounded-2xl border transition-all ${
              !canSplit
                ? 'opacity-40 cursor-not-allowed border-border bg-background'
                : selectedOption === 'split'
                ? 'border-primary bg-primary/5 ring-1 ring-primary cursor-pointer'
                : 'border-border bg-card hover:border-slate-300 cursor-pointer'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-xl shrink-0 ${
                  selectedOption === 'split' ? 'bg-primary text-white' : 'bg-black/5 text-textSecondary'
                }`}
              >
                <Split className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-textPrimary">Split into two sessions</h4>
                  {canSplit ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-background border border-border text-textSecondary">
                      {Math.ceil(task.durationMinutes / 2)}m + {Math.floor(task.durationMinutes / 2)}m
                    </span>
                  ) : (
                    <span className="text-[10px] text-accentRose font-medium">Requires &gt; 40 mins</span>
                  )}
                </div>
                <p className="text-[11px] text-textSecondary mt-0.5">
                  Divides this into two manageable parts so you don't burn out tackling a long block.
                </p>
              </div>
            </div>
          </div>

          {/* OPTION 3 */}
          <div
            onClick={() => {
              if (canDeferLower) setSelectedOption('deferLower');
            }}
            className={`p-3.5 rounded-2xl border transition-all ${
              !canDeferLower
                ? 'opacity-40 cursor-not-allowed border-border bg-background'
                : selectedOption === 'deferLower'
                ? 'border-primary bg-primary/5 ring-1 ring-primary cursor-pointer'
                : 'border-border bg-card hover:border-slate-300 cursor-pointer'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-xl shrink-0 ${
                  selectedOption === 'deferLower' ? 'bg-primary text-white' : 'bg-black/5 text-textSecondary'
                }`}
              >
                <ArrowDownRight className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-textPrimary">Defer a lower-priority task</h4>
                  {lowestPriorityCandidate && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-accentAmber/15 text-[#B76E00] font-medium truncate max-w-[120px]">
                      {lowestPriorityCandidate.title}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-textSecondary mt-0.5">
                  Keep "{task.title}" for today, but postpone {lowestPriorityCandidate ? `"${lowestPriorityCandidate.title}"` : 'a lower-priority item'} to tomorrow.
                </p>
              </div>
            </div>
          </div>

          {/* Custom Date/Time Option */}
          <div
            onClick={() => setSelectedOption('custom')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
              selectedOption === 'custom'
                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                : 'border-border bg-card hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-xl shrink-0 ${
                  selectedOption === 'custom' ? 'bg-primary text-white' : 'bg-black/5 text-textSecondary'
                }`}
              >
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-textPrimary">Custom reschedule date & time</h4>
                <p className="text-[11px] text-textSecondary mt-0.5 mb-2">Pick an exact custom day and hour.</p>

                {selectedOption === 'custom' && (
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-border/80">
                    <input
                      type="date"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-border bg-card text-textPrimary"
                    />
                    <input
                      type="time"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-border bg-card text-textPrimary font-mono"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex items-center justify-between border-t border-border/80">
          <p className="text-[11px] text-textSecondary">
            State will only mutate upon confirmation.
          </p>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={<Check className="w-4 h-4" />}
              onClick={handleApply}
            >
              Apply Recommendation
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
