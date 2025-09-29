import React from 'react';

interface MeetingDetailsInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const MeetingDetailsInput: React.FC<MeetingDetailsInputProps> = ({
  value,
  onChange,
}) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <label className="block text-sm font-medium text-darkText">
        Meeting Details (Optional)
      </label>
      <span className="text-xs text-darkText">
        {value.length}/1000
      </span>
    </div>
    <textarea
      value={value}
      onChange={(e) => {
        if (e.target.value.length <= 1000) {
          onChange(e.target.value);
        }
      }}
      placeholder="Enter Meeting Details"
      rows={4}
      maxLength={1000}
      className="w-full px-3 py-2 border border-borderColor rounded-md bg-primary focus:outline-none focus:ring-2 focus:ring-borderColor resize-none text-darkText text-sm"
    />
  </div>
);
