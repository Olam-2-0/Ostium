import React, { useState, useEffect } from 'react';
import { useMindVibe } from '../../hooks/useMindVibe';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import type { Priority } from '../../types';

export const EditTaskModal: React.FC = () => {
  const { uiState, closeModal, tasks, updateTask } = useMindVibe();

  const taskId = uiState.editingTaskId;
  const task = tasks.find((t) => t.id === taskId);

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [scheduledTime, setScheduledTime] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setSubject(task.subject);
      setDueDate(task.dueDate);
      setPriority(task.priority);
      setDurationMinutes(task.durationMinutes);
      setScheduledTime(task.scheduledTime || '');
    }
  }, [task]);

  const isOpen = uiState.activeModal === 'editTask' && !!task;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !title.trim()) return;

    updateTask(task.id, {
      title: title.trim(),
      subject: subject.trim() || 'General',
      dueDate,
      priority,
      durationMinutes: Number(durationMinutes),
      scheduledTime: scheduledTime ? scheduledTime : null,
    });

    closeModal();
  };

  if (!task) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title="Edit Task Details"
      subtitle="Modify parameters for this assignment"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-textPrimary mb-1.5">Task Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-textPrimary"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-textPrimary mb-1.5">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-textPrimary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-textPrimary mb-1.5">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-textPrimary"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-textPrimary mb-1.5">Due Date *</label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-textPrimary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-textPrimary mb-1.5">Duration (mins)</label>
            <input
              type="number"
              min="5"
              step="5"
              required
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-textPrimary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-textPrimary mb-1.5">Scheduled Time</label>
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-textPrimary"
            />
          </div>
        </div>

        <div className="pt-3 flex items-center justify-end gap-2.5">
          <Button type="button" variant="secondary" size="md" onClick={closeModal}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
