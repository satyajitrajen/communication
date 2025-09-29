import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { 
  closeMeetingModal, 
  updateField
} from '../../store/Slices/MeetingScheduleSlice';
import { User } from '../../types/ConversationInfoType';
import { parseISO } from 'date-fns';
import { X } from 'lucide-react';

// Component Imports
import { DateTimePicker } from './components/DateTimePicker';
import { MemberSelector } from './components/MemberSelector';
import { MeetingLink } from './components/MeetingLink';
import { MeetingDetailsInput } from './components/MeetingDetailsInput';

const MeetingScheduleModal: React.FC = () => {
  const dispatch = useDispatch();
  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
  
  const {
    isModalOpen,
    title,
    selectedMember,
    date,
    startTime,
    endTime,
    meetingLink,
    meetingDetails,
    searchQuery
  } = useSelector((state: RootState) => state.meetingSchedule);

  // Get conversation users from Redux
  const conversationUsers = useSelector((state: RootState) => {
    const currentConversation = (state as any).CurrentConversation?.conversationDetails;
    const users = currentConversation?.ConversationsUsers?.map((cu: any) => cu.User) || [];
    
    // Filter and validate users
    return users.filter((user: any): user is User => {
      return user && 
             typeof user === 'object' && 
             'user_name' in user && 
             'user_id' in user;
    });
  });

  // Filter users based on search query
  const filteredUsers = (conversationUsers as User[]).filter(user =>
    user.user_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle member selection
  const handleSelectMember = (user: User) => {
    dispatch(updateField({ field: 'selectedMember', value: user }));
    setIsMemberDropdownOpen(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(meetingLink);
    // You can add a toast notification here
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log({
      title,
      selectedMember,
      date,
      startTime,
      endTime,
      meetingLink,
      meetingDetails
    });
    dispatch(closeMeetingModal());
  };
  
  // Helper function to update field values
  const handleFieldChange = (
    field: 'title' | 'selectedMember' | 'date' | 'startTime' | 'endTime' | 'meetingLink' | 'meetingDetails' | 'searchQuery',
    value: any
  ) => {
    dispatch(updateField({ field, value }));
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/15 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-primary rounded-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div></div>
            <h2 className="text-xl font-medium">Meeting Schedule</h2>
            <button
              onClick={() => dispatch(closeMeetingModal())}
              className=""
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium  mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="Enter Title"
                  className="w-full px-3 py-2 border border-borderColor rounded-md bg-primary focus:outline-none  text-sm"
                  required
                />
              </div>

              {/* Member Selector */}
              <MemberSelector
                selectedMember={selectedMember}
                onSelect={handleSelectMember}
                searchQuery={searchQuery}
                onSearchChange={(query) => handleFieldChange('searchQuery', query)}
                filteredUsers={filteredUsers}
                isOpen={isMemberDropdownOpen}
                onToggle={() => setIsMemberDropdownOpen(!isMemberDropdownOpen)}
              />

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Date Picker */}
                <DateTimePicker
                  type="date"
                  label="Date"
                  value={date || ''}
                  onChange={(value) => handleFieldChange('date', value)}
                  minDate={new Date()}
                  required
                />

                {/* Start Time Picker */}
                <DateTimePicker
                  type="time"
                  label="Start"
                  value={startTime || ''}
                  onChange={(value) => handleFieldChange('startTime', value)}
                  minTime={startTime ? parseISO(`2000-01-01T${startTime}`) : undefined}
                  required
                />

                {/* End Time Picker */}
                <DateTimePicker
                  type="time"
                  label="End"
                  value={endTime || ''}
                  onChange={(value) => handleFieldChange('endTime', value)}
                  minTime={startTime ? parseISO(`2000-01-01T${startTime}`) : undefined}
                  maxTime={endTime ? parseISO(`2000-01-01T${endTime}`) : undefined}
                  required
                />
              </div>

              {/* Meeting Link */}
              <MeetingLink 
                meetingLink={meetingLink} 
                onCopy={handleCopyLink} 
              />

              {/* Meeting Details */}
              <MeetingDetailsInput
                value={meetingDetails}
                onChange={(value) => handleFieldChange('meetingDetails', value)}
              />

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-2.5 px-4 rounded-md font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                >
                  Schedule Meeting
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MeetingScheduleModal;
