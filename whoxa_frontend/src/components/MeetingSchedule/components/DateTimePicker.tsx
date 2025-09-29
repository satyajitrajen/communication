import React from 'react';
import { format, parseISO } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, Clock } from 'lucide-react';

interface DateTimePickerProps {
  type: 'date' | 'time';
  label: string;
  value: string;
  onChange: (value: string) => void;
  minDate?: Date;
  minTime?: Date;
  maxTime?: Date;
  required?: boolean;
  className?: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  type,
  label,
  value,
  onChange,
  minDate,
  minTime,
  maxTime,
  required = false,
  className = '',
}) => {
  const isDate = type === 'date';
  const Icon = isDate ? Calendar : Clock;
  
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <DatePicker
          selected={
            isDate 
              ? (value ? new Date(value) : new Date())
              : (value ? parseISO(`2000-01-01T${value}`) : new Date())
          }
          onChange={(date) => {
            if (!date) return;
            const formattedValue = isDate 
              ? format(date, 'yyyy-MM-dd')
              : format(date, 'HH:mm');
            onChange(formattedValue);
          }}
          minDate={isDate ? minDate : undefined}
          minTime={!isDate ? minTime : undefined}
          maxTime={!isDate ? maxTime : undefined}
          showTimeSelect={!isDate}
          showTimeSelectOnly={!isDate}
          timeIntervals={15}
          timeCaption="Time"
          dateFormat={isDate ? 'MMM d, yyyy' : 'h:mm aa'}
          placeholderText={isDate ? 'Select date' : 'Select time'}
          className="w-full pl-10 pr-3 text-darkText bg-primary py-2 border border-borderColor rounded-md focus:outline-none text-sm"
          required={required}
        />
        <Icon className="absolute left-3 top-2.5 h-4 w-4 text-darkText pointer-events-none" />
      </div>
    </div>
  );
};
