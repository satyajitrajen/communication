import Stories from "react-insta-stories";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks";
import { RxCross1 } from "react-icons/rx";
import { updateViewState } from "../../../../store/Slices/ViewManagerSlice";
import SendStatus from "./SendStatus";

export default function AddStatusViewer() {
  const addStatus = useAppSelector((state) => state.addStatus);
  const files = addStatus.files || [];
  const userData = useAppSelector((state) => state.userData);
  const dispatch = useAppDispatch();
  if (files.length === 0) return null;

  // Map local files to stories
  const stories = files.map((file) => {
    const url = URL.createObjectURL(file);
    const isVideo = file.type.startsWith("video");

    return {
      url,
      type: isVideo ? "video" : "image",
      // ⏸️ Stop timer
      duration: Infinity,
      header: {
        heading: "My Status",
        subheading: userData.user_name,
        profileImage: userData.profile_image,
      },
    };
  });

  return (
    <div className="z-50 flex max-h-[100vh] w-full max-w-xl justify-center overflow-hidden rounded-xl bg-black">
      {/* Close Button */}
      <button
        className="absolute right-5 top-5 z-50 rounded-full bg-black/50 p-2 text-white"
        onClick={() => {
          dispatch(updateViewState({ showAddStatusModal: false }));
        }}
      >
        <RxCross1 className="text-xl" />
      </button>

      {/* Story Viewer */}
      <Stories
        width={"100%"}
        height={"83dvh"}
        stories={stories}
        onAllStoriesEnd={() => {
          dispatch(updateViewState({ showAddStatusModal: false }));
        }}
      />
      <SendStatus />
    </div>
  );
}
