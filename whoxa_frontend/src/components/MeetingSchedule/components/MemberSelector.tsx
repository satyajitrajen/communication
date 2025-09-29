import React, { useRef, useEffect } from 'react';
import { User } from '../../../../types/ConversationInfoType';
import { Search } from 'lucide-react';

interface MemberOptionProps {
  user: User;
  onSelect: (user: User) => void;
  isSelected: boolean;
}

const MemberOption: React.FC<MemberOptionProps> = ({ user, onSelect, isSelected }) => (
  <div
    className={`flex items-center p-2 hover:bg-gray-100 cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`}
    onClick={() => onSelect(user)}
  >
    <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
      <img
        src={user.profile_image || '/default-avatar.png'}
        alt={user.user_name}
        className="w-full h-full object-cover"
      />
    </div>
    <span className="text-sm">{user.user_name}</span>
  </div>
);

interface MemberSelectorProps {
  selectedMember: User | null;
  onSelect: (user: User) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filteredUsers: User[];
  isOpen: boolean;
  onToggle: () => void;
}

export const MemberSelector: React.FC<MemberSelectorProps> = ({
  selectedMember,
  onSelect,
  searchQuery,
  onSearchChange,
  filteredUsers,
  isOpen,
  onToggle,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        Member <span className="text-red-500">*</span>
      </label>
      <div className="relative" ref={dropdownRef}>
        <div
          className="flex items-center justify-between w-full px-3 py-2 border border-borderColor rounded-md cursor-pointer"
          onClick={() => onToggle()}
        >
          {selectedMember ? (
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                <img
                  src={selectedMember.profile_image || '/default-avatar.png'}
                  alt={selectedMember.user_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm">{selectedMember.user_name}</span>
            </div>
          ) : (
            <span className="text-lightText text-sm">Select Member</span>
          )}
          <svg
            className={`w-5 h-5 text-lightText transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-primary border border-borderColor rounded-md shadow-lg max-h-60 overflow-auto">
            <div className="p-2 border-b border-borderColor">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-lightText" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search members..."
                  className="w-full pl-8 pr-3 py-2 text-sm border-0 focus:ring-0 bg-primary focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <div className="py-1">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <MemberOption
                    key={user.user_id}
                    user={user}
                    onSelect={onSelect}
                    isSelected={selectedMember?.user_id === user.user_id}
                  />
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No members found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
