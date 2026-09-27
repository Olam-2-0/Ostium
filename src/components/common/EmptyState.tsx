import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  emoji?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  emoji,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-border bg-card/60 ${className}`}
    >
      {emoji ? (
        <span className="text-3xl mb-3 select-none">{emoji}</span>
      ) : icon ? (
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
          {icon}
        </div>
      ) : null}
      <h3 className="text-sm font-semibold text-textPrimary">{title}</h3>
      {description && <p className="text-xs text-textSecondary mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
