import { useState } from "react";
import Stories from "react-insta-stories";
import { ChevronLeft, ChevronRight } from "lucide-react"; // icons
import { RxCross1 } from "react-icons/rx";

interface StoryItem {
  url: string;
  type?: "image" | "video";
  header?: { heading: string; subheading: string; profileImage: string };
  duration?: number;
  statusId: number;
  mediaId?: number;
  user_id?: number;
  status_text?: string;
}

interface UserStories {
  user: {
    name: string;
    profilePic: string;
  };
  stories: StoryItem[];
}

interface StatusViewerProps {
  groupedUsers: UserStories[];
  onClose: () => void;
}

import { updateViewState } from "../../../../store/Slices/ViewManagerSlice";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks";
import useApiPost from "../../../../hooks/PostData";
import { updateStatusViewCount } from "../../../../store/Slices/StatusSlice";
import { updateSendMessageData } from "../../../../store/Slices/SendMessageSlice";
import StatusReply from "./StatusReply";

export function StatusViewer({ groupedUsers, onClose }: StatusViewerProps) {
  const dispatch = useAppDispatch();
  const { postData } = useApiPost();
const [statusMediaIndex, setStatusMediaIndex] = useState(0)
  // get current user index from global store
  const currentStatusId = useAppSelector(
    (state) => state.ViewManager.currentStatusId,
  );

  if (!currentStatusId) return null;

  // find the user that contains this status
  const currentUserIndex = groupedUsers.findIndex((user) =>
    user.stories.some((s) => s.statusId === currentStatusId),
  );

  if (currentUserIndex === -1) return null; // not found

  const active = groupedUsers[currentUserIndex];

  function handleNextUser() {
    const nextIndex = currentUserIndex + 1;
    if (nextIndex < groupedUsers.length) {
      const nextStatusId = groupedUsers[nextIndex].stories[0].statusId;
      dispatch(updateViewState({ currentStatusId: nextStatusId }));
    } else {
      onClose();
    }
  }

  function handlePrevUser() {
    const prevIndex = currentUserIndex - 1;
    if (prevIndex >= 0) {
      const prevStatusId = groupedUsers[prevIndex].stories[0].statusId;
      dispatch(updateViewState({ currentStatusId: prevStatusId }));
    }
  }

  async function handleStoryStart(index: number) {
    const story = active.stories[index];
    setStatusMediaIndex(index)
    if (!story) return;
    console.log(story);
    dispatch(
      updateSendMessageData({
        status_id: story.statusId,
        other_user_id: story.user_id,
      }),
    );
    const res = await postData("view-status", {
      status_id: story.statusId,
      status_count: index + 1, // or story.mediaId if needed
    });

    if (res?.success) {
      dispatch(
        updateStatusViewCount({
          statusId: story.statusId,
          statusCount: index + 1,
        }),
      );
    }
  }

  return (
    <div className="flex max-h-[100vh] w-full max-w-xl justify-center overflow-hidden rounded-xl">
      {/* Prev button */}
      {currentUserIndex > 0 && (
        <button
          className="absolute left-20 top-1/2 z-50 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white"
          onClick={handlePrevUser}
        >
          <ChevronLeft />
        </button>
      )}

      {/* Next button */}
      {currentUserIndex < groupedUsers.length - 1 && (
        <button
          className="absolute right-20 top-1/2 z-50 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white"
          onClick={handleNextUser}
        >
          <ChevronRight />
        </button>
      )}
      <button
        className="absolute right-10 top-10 z-50 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white"
        onClick={onClose}
      >
        <RxCross1 className="text-xl" />
      </button>

      <Stories
        width={"100%"}
        height={"83dvh"}
        key={currentUserIndex} // resets when user changes
        stories={active.stories}
        onStoryStart={(index: number) => {
          handleStoryStart(index);
        }}
        // onStoryEnd={(index: number) => {
        //   handleStoryEnd(index);
        // }}
        onAllStoriesEnd={handleNextUser}
      />
      <button
        className="absolute  bottom-36 z-50 -translate-y-1/2 p-2 text-white"
      >
        {active.stories[statusMediaIndex]?.status_text}
      </button>

      <StatusReply />
    </div>
  );
}
