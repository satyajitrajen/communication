import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { openMeetingModal, closeMeetingModal, resetForm } from '../store/Slices/MeetingScheduleSlice';

export const useMeetingSchedule = () => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector((state: RootState) => state.meetingSchedule.isModalOpen);

  const openModal = () => {
    dispatch(openMeetingModal());
  };

  const closeModal = () => {
    dispatch(closeMeetingModal());
  };

  const resetMeetingForm = () => {
    dispatch(resetForm());
  };

  return {
    isModalOpen,
    openModal,
    closeModal,
    resetMeetingForm,
  };
};
