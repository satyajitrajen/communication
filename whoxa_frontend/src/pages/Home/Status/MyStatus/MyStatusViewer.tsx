import Stories from "react-insta-stories";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks";
import { RxCross1 } from "react-icons/rx";
import { HiOutlineEye } from "react-icons/hi";
import { updateViewState } from "../../../../store/Slices/ViewManagerSlice";
import StatusViewes from "./StatusViewes";
import { useState } from "react";

export default function MyStatusViewer() {
  const userData = useAppSelector((state) => state.userData);
  const statusData = useAppSelector((state) => state.status);
  const dispatch = useAppDispatch();
  const [statusMediaIndex, setStatusMediaIndex] = useState(0);
  const stories = statusData.myStatus.Statuses[0].StatusMedia.map((media) => {
    const url = media.url;
    const isVideo = media.url.endsWith(".mp4");

    return {
      url,
      type: isVideo ? "video" : "image",
      duration: 4000,
      header: {
        heading: "My Status",
        subheading: userData.user_name,
        profileImage: userData.profile_image,
      },
      statusId: media.status_id,
      mediaId: media.status_media_id,
      user_id: userData.user_id,
      status_text: media.status_text,
    };
  });

  return (
    <div className="relative z-50 flex max-h-[100vh] w-fit max-w-xl justify-center overflow-hidden rounded-xl bg-black">
      {/* Close Button */}
      <button
        className="absolute right-5 top-5 z-[9999] rounded-full bg-black/50 p-2 text-white"
        onClick={() => dispatch(updateViewState({ showMyStatusModal: false }))}
      >
        <RxCross1 className="text-xl" />
      </button>

      {/* Story Viewer */}
      <Stories
        width="100%"
        height="83dvh"
        stories={stories}
        onStoryStart={(index: number) => {
          setStatusMediaIndex(index);
        }}
        onAllStoriesEnd={() => {
          dispatch(updateViewState({ showMyStatusModal: false }));
        }}
      />

      {/* 👁 Eye Button */}
      <div
        onClick={() => dispatch(updateViewState({ showStatusViews: true }))}
        className="absolute bottom-7 left-1/2 z-[9999] flex -translate-x-1/2 cursor-pointer items-center justify-center space-x-1 text-white"
      >
        <HiOutlineEye />
        <span>{statusData.myStatus.Statuses[0]?.StatusViews.length || 0}</span>
      </div>
      <button
        className="absolute bottom-10 z-50 -translate-y-1/2 p-2 text-white"
      >
        {stories[statusMediaIndex].status_text}
      </button>
      {/* Views Bottom Sheet */}
      <StatusViewes />
    </div>
  );
}
