import React from 'react';
import type { Task } from '../../types';
import { TaskCard } from './TaskCard';
import { EmptyState } from '../common/EmptyState';

interface TaskListProps {
  tasks: Task[];
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  compact?: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  emptyTitle = 'No matching tasks.',
  emptyDescription,
  emptyAction,
  compact = false,
}) => {
  if (tasks.length === 0) {
    return (
      <EmptyState
        emoji="📝"
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <div className="space-y-2.5">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} compact={compact} />
      ))}
    </div>
  );
};
