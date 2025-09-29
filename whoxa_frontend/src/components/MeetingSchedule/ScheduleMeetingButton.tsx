import React from 'react';
import { useMeetingSchedule } from '../../hooks/useMeetingSchedule';
import { Calendar as CalendarIcon } from 'lucide-react';

interface ScheduleMeetingButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

const ScheduleMeetingButton: React.FC<ScheduleMeetingButtonProps> = ({
  className = '',
  variant = 'default',
  size = 'md',
  children,
}) => {
  const { openModal } = useMeetingSchedule();

  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';
  
  const variantStyles = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-blue-500',
    ghost: 'hover:bg-gray-100 focus-visible:ring-blue-500',
    link: 'text-blue-600 underline-offset-4 hover:underline focus-visible:ring-blue-500',
  };

  const sizeStyles = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 py-2 px-4',
    lg: 'h-11 px-8',
  };

  return (
    <button
      onClick={openModal}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      <CalendarIcon className="mr-2 h-4 w-4" />
      {children || 'Schedule Meeting'}
    </button>
  );
};

export default ScheduleMeetingButton;
