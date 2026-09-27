import React from 'react';
import type { Priority } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'high' | 'medium' | 'low' | 'neutral' | 'success' | 'indigo' | 'amber';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  const variantClasses: Record<string, string> = {
    high: 'bg-accentRose/15 text-accentRose border-accentRose/20',
    medium: 'bg-accentAmber/15 text-[#C98220] border-accentAmber/20',
    low: 'bg-primary/10 text-primary border-primary/20',
    neutral: 'bg-black/5 text-textSecondary border-border',
    success: 'bg-accentGreen/15 text-accentGreen border-accentGreen/20',
    indigo: 'bg-secondaryIndigo/15 text-secondaryIndigo border-secondaryIndigo/20',
    amber: 'bg-accentAmber/15 text-[#C98220] border-accentAmber/20',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${variantClasses[variant] || variantClasses.neutral} ${sizeClasses} ${className}`}
    >
      {children}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  const variant = priority === 'High' ? 'high' : priority === 'Medium' ? 'medium' : 'low';
  return (
    <Badge variant={variant} size="sm">
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          priority === 'High'
            ? 'bg-accentRose'
            : priority === 'Medium'
            ? 'bg-accentAmber'
            : 'bg-primary'
        }`}
      />
      {priority}
    </Badge>
  );
};
