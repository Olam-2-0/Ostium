import React, { useState } from 'react';
import { useMindVibe } from '../../hooks/useMindVibe';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import type { Priority } from '../../types';
import { todayISO } from '../../utils/dateUtils';

export const QuickAddModal: React.FC = () => {
  const { uiState, closeModal, addTask } = useMindVibe();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [dueDate, setDueDate] = useState(todayISO());
  const [priority, setPriority] = useState<Priority>('Medium');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOpen = uiState.activeModal === 'quickAddTask';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double click duplicate

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!dueDate) {
      setError('Due date is required.');
      return;
    }
    if (!durationMinutes || durationMinutes <= 0) {
      setError('Duration must be greater than 0 minutes.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    addTask({
      title: title.trim(),
      subject: subject.trim() || 'General',
      dueDate,
      priority,
      durationMinutes: Number(durationMinutes),
    });

    // Reset and close
    setTitle('');
    setDurationMinutes(45);
    setIsSubmitting(false);
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title="Add New Assignment"
      subtitle="Organize your coursework and study sessions"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-accentRose/10 border border-accentRose/20 text-accentRose text-xs font-medium">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-textPrimary mb-1.5">
            Assignment / Task Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Operating Systems Assignment 2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-textPrimary"
          />
        </div>

        {/* Subject & Priority Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-textPrimary mb-1.5">Subject / Course</label>
            <input
              type="text"
              placeholder="e.g. Mathematics"
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
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Due Date & Duration Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            <label className="block text-xs font-semibold text-textPrimary mb-1.5">
              Estimated Duration (mins) *
            </label>
            <input
              type="number"
              min="5"
              max="600"
              step="5"
              required
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-textPrimary"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-3 flex items-center justify-end gap-2.5">
          <Button type="button" variant="secondary" size="md" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting || !title.trim()}
          >
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
