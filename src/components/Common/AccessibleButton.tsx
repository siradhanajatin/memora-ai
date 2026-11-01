import React from 'react';
import { sound } from '../../services/soundService';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'warm' | 'subtle' | 'outline';
  size?: 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const AccessibleButton: React.FC<Props> = ({
  variant = 'primary',
  size = 'lg',
  icon,
  children,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      sound.playClick();
      if (onClick) onClick(e);
    }
  };

  const baseStyles = "inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-emerald-400/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-sm";

  const sizeStyles = {
    md: 'px-4 py-2.5 text-base min-h-[44px] gap-2',
    lg: 'px-6 py-3.5 text-lg min-h-[54px] gap-2.5',
    xl: 'px-8 py-4 text-xl min-h-[64px] gap-3 font-extrabold',
  }[size];

  const variantStyles = {
    primary: 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-900/20 active:bg-emerald-900',
    secondary: 'bg-teal-700 hover:bg-teal-800 text-white shadow-teal-900/20 active:bg-teal-900',
    warm: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-900/20 active:bg-amber-800',
    subtle: 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200',
    outline: 'bg-white hover:bg-stone-50 text-emerald-800 border-2 border-emerald-600',
  }[variant];

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
