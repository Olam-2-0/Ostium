import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs font-medium gap-1.5',
    md: 'px-4 py-2 text-sm font-medium gap-2',
    lg: 'px-5 py-2.5 text-base font-semibold gap-2.5',
  }[size];

  const variantClasses = {
    primary:
      'bg-primary hover:bg-primary-hover text-white shadow-sm hover:shadow-subtle active:scale-[0.98]',
    secondary:
      'bg-white text-textPrimary border border-border hover:bg-black/5 hover:border-slate-300 shadow-subtle active:scale-[0.98]',
    outline:
      'border border-primary text-primary hover:bg-primary/5 active:scale-[0.98]',
    ghost:
      'text-textSecondary hover:text-textPrimary hover:bg-black/5',
    danger:
      'bg-accentRose/10 text-accentRose hover:bg-accentRose/20 border border-accentRose/20 active:scale-[0.98]',
  }[variant];

  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-xl cursor-pointer select-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
