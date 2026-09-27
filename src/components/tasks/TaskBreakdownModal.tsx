import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Check, Plus, Trash2 } from 'lucide-react';
import { useMindVibe } from '../../hooks/useMindVibe';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { generateTaskBreakdown } from '../../utils/aiBreakdown';
import type { Subtask } from '../../types';

export const TaskBreakdownModal: React.FC = () => {
  const { uiState, closeModal, tasks, applyTaskBreakdown } = useMindVibe();

  const taskId = uiState.breakdownTaskId;
  const task = tasks.find((t) => t.id === taskId);

  const [previewSubtasks, setPreviewSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newSubtaskMins, setNewSubtaskMins] = useState(15);

  useEffect(() => {
    if (task) {
      if (task.subtasks && task.subtasks.length > 0) {
        setPreviewSubtasks([...task.subtasks]);
      } else {
        const generated = generateTaskBreakdown(task.title, task.durationMinutes);
        setPreviewSubtasks(generated);
      }
    }
  }, [task]);

  const isOpen = uiState.activeModal === 'taskBreakdown' && !!task;

  const totalMinutes = previewSubtasks.reduce((sum, s) => sum + s.estimatedMinutes, 0);

  const handleApply = () => {
    if (!task) return;
    // Only update task.subtasks, do not create top-level tasks
    applyTaskBreakdown(task.id, previewSubtasks);
    closeModal();
  };

  const handleAddCustomSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const item: Subtask = {
      id: `st-custom-${Date.now()}`,
      title: newSubtaskTitle.trim(),
      estimatedMinutes: Number(newSubtaskMins) || 15,
      completed: false,
    };
    setPreviewSubtasks((prev) => [...prev, item]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setPreviewSubtasks((prev) => prev.filter((s) => s.id !== id));
  };

  if (!task) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title="AI Task Breakdown"
      subtitle={`Structuring: "${task.title}" (${task.durationMinutes}m duration)`}
    >
      <div className="space-y-4">
        <div className="p-3 rounded-xl bg-secondaryIndigo/10 border border-secondaryIndigo/20 text-xs text-textPrimary flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-secondaryIndigo shrink-0" />
          <span>
            MindVibe generated bite-sized study blocks. Review and adjust before adding them to your planner.
          </span>
        </div>

        {/* Subtasks Preview List */}
        <div className="space-y-2">
          {previewSubtasks.map((st, idx) => (
            <div
              key={st.id}
              className="p-3 rounded-xl border border-border bg-background flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <span className="w-5 h-5 rounded-md bg-black/5 text-textSecondary flex items-center justify-center font-mono text-[11px] font-semibold shrink-0">
                  {idx + 1}
                </span>
                <span className="font-semibold text-textPrimary truncate">{st.title}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="flex items-center gap-1 font-mono text-textSecondary bg-card px-2 py-0.5 rounded border border-border">
                  <Clock className="w-3 h-3" />
                  {st.estimatedMinutes}m
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveSubtask(st.id)}
                  className="p-1 text-textSecondary hover:text-accentRose rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add custom mini-step */}
        <div className="pt-2 flex items-center gap-2">
          <input
            type="text"
            placeholder="Add custom subtask..."
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary text-textPrimary"
          />
          <input
            type="number"
            min="5"
            max="120"
            step="5"
            value={newSubtaskMins}
            onChange={(e) => setNewSubtaskMins(Number(e.target.value))}
            className="w-16 px-2 py-1.5 text-xs rounded-xl border border-border bg-background text-textPrimary font-mono"
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={handleAddCustomSubtask}
          >
            Add
          </Button>
        </div>

        {/* Total calculation indicator */}
        <div className="flex items-center justify-between text-xs text-textSecondary pt-1 border-t border-border/80">
          <span>Total allocated time:</span>
          <span
            className={`font-mono font-semibold ${
              totalMinutes > task.durationMinutes ? 'text-accentRose' : 'text-accentGreen'
            }`}
          >
            {totalMinutes}m / {task.durationMinutes}m
          </span>
        </div>

        {/* Apply to Planner Button */}
        <div className="pt-3 flex items-center justify-end gap-2.5">
          <Button variant="secondary" size="md" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={<Check className="w-4 h-4" />}
            onClick={handleApply}
          >
            Add to Planner
          </Button>
        </div>
      </div>
    </Modal>
  );
};
