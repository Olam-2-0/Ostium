import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowUp, ArrowDown } from 'lucide-react';
import { useMindVibe } from '../../hooks/useMindVibe';
import { Button } from '../common/Button';
import { PriorityBadge } from '../common/Badge';

export const DailyPlanCard: React.FC = () => {
  const { generateDailyPlan, updateTaskSchedule } = useMindVibe();
  const plan = generateDailyPlan();
  const planSignature = plan.taskSlots.map((s) => s.id).join('|');
  const [taskSlots, setTaskSlots] = useState(() => plan.taskSlots);
  const [justAccepted, setJustAccepted] = useState(false);

  // Keep synced if plan tasks change
  React.useEffect(() => {
    setTaskSlots(plan.taskSlots);
  }, [planSignature]);

  // Reorder up/down controls
  const moveSlot = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= taskSlots.length) return;

    const copy = [...taskSlots];
    const temp = copy[idx];
    copy[idx] = copy[targetIdx];
    copy[targetIdx] = temp;

    // Recalculate scheduled start times
    let curMinute = 9 * 60;
    const recomputed = copy.map((slot) => {
      const startH = Math.floor(curMinute / 60);
      const startM = curMinute % 60;
      const startTime = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`;
      curMinute += slot.durationMinutes + 15; // with break
      return { ...slot, startTime };
    });

    setTaskSlots(recomputed);
  };

  const handleAcceptPlan = () => {
    // CRITICAL: Accept Plan must ONLY update: scheduledTime on existing tasks
    taskSlots.forEach((slot) => {
      if (slot.taskId) {
        updateTaskSchedule(slot.taskId, slot.startTime);
      }
    });
    setJustAccepted(true);
    setTimeout(() => setJustAccepted(false), 3000);
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-secondaryIndigo flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-textPrimary tracking-tight">Today's AI Schedule</h3>
            <p className="text-xs text-textSecondary">
              Energy-ordered blocks • Breaks & buffers inserted
            </p>
          </div>
        </div>

        {taskSlots.length > 0 && (
          <Button
            variant="primary"
            size="sm"
            icon={<CheckCircle2 className="w-4 h-4" />}
            onClick={handleAcceptPlan}
          >
            {justAccepted ? 'Plan Accepted ✓' : 'Accept Plan'}
          </Button>
        )}
      </div>

      {justAccepted && (
        <div className="mb-4 p-3 rounded-xl bg-accentGreen/15 border border-accentGreen/30 text-accentGreen text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Plan accepted! Only scheduledTime was applied to existing tasks.</span>
        </div>
      )}

      {taskSlots.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-background border border-dashed border-border">
          <span className="text-2xl mb-1 inline-block">☕</span>
          <p className="text-xs font-semibold text-textPrimary">No tasks to schedule today</p>
          <p className="text-[11px] text-textSecondary mt-0.5">
            Add tasks or check back when you have coursework due.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {taskSlots.map((slot, index) => (
            <div
              key={slot.id}
              className="p-3 rounded-xl border border-border bg-background hover:bg-card hover:border-primary/30 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold shrink-0">
                  {slot.startTime}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-textPrimary truncate">{slot.title}</p>
                  <p className="text-[11px] text-textSecondary flex items-center gap-2 mt-0.5">
                    <span>{slot.subject}</span>
                    <span>•</span>
                    <span>{slot.durationMinutes}m duration</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {slot.priority && <PriorityBadge priority={slot.priority} />}
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveSlot(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-textSecondary hover:text-textPrimary disabled:opacity-20"
                    title="Move up"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => moveSlot(index, 'down')}
                    disabled={index === taskSlots.length - 1}
                    className="p-1 text-textSecondary hover:text-textPrimary disabled:opacity-20"
                    title="Move down"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Wellness Slots Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            {plan.wellnessSlots.slice(0, 2).map((w) => (
              <div
                key={w.id}
                className="p-2.5 rounded-xl border border-dashed border-accentGreen/30 bg-accentGreen/5 text-xs text-accentGreen flex items-center justify-between"
              >
                <span className="font-semibold text-[11px]">{w.title}</span>
                <span className="font-mono text-[10px] text-accentGreen/80">{w.startTime}</span>
              </div>
            ))}
          </div>

          {/* Deferred Low-Priority Tasks */}
          {plan.deferredTasks.length > 0 && (
            <div className="mt-3 p-3 rounded-xl bg-accentRose/5 border border-accentRose/20 text-xs text-textSecondary">
              <span className="font-semibold text-accentRose">Energy Protected: </span>
              {plan.deferredTasks.map((t) => t.title).join(', ')} deferred from today's plan due to stress/low capacity.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
