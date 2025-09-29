import React from 'react';
import { Copy } from 'lucide-react';

interface MeetingLinkProps {
  meetingLink: string;
  onCopy: () => void;
}

export const MeetingLink: React.FC<MeetingLinkProps> = ({ meetingLink, onCopy }) => (
  <div>
    <label className="block text-sm font-medium mb-1">
      Meeting Link
    </label>
    <div className="flex">
      <input
        type="text"
        value={meetingLink}
        readOnly
        className="flex-1 px-3 py-2 border border-borderColor rounded-l-md focus:outline-none bg-primary text-darkText text-sm"
      />
      <button
        type="button"
        onClick={onCopy}
        className="px-3 py-2 border border-l-0 border-borderColor rounded-r-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-borderColor"
        title="Copy to clipboard"
      >
        <Copy className="h-4 w-4 text-darkText" />
      </button>
    </div>
  </div>
);
