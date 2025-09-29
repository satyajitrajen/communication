import { VscSend } from "react-icons/vsc";
import { useTheme } from "../../../../context/ThemeProvider";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks";
import useApiPost from "../../../../hooks/PostData";
import { ClipLoader } from "react-spinners";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { updateAddStatus } from "../../../../store/Slices/AddStatusSlice";
import toast from "react-hot-toast";
import EmojiPickerCompo from "../../MessageList/SendMessage/EmojiPickerCompo";
import { updateViewState } from "../../../../store/Slices/ViewManagerSlice";
import { useStatusList } from "../../../../store/api/useStatusList";

export default function SendStatus() {
  const { theme } = useTheme(); // @ts-ignore
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { refetch: refetchStatusList } = useStatusList();
  const { postData, loading } = useApiPost();

  const addStatus = useAppSelector((state) => state.addStatus);
  const { status_text, files } = addStatus;

  const keydownListenerRef = useRef<(e: KeyboardEvent) => void>();

  // Handle Enter key to send status
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (status_text || files.length > 0) {
          sendStatusApiCall(e);
        }
      }
    };

    keydownListenerRef.current = handleKeyDown;
  }, [status_text, files]);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (keydownListenerRef.current) {
        keydownListenerRef.current(e);
      }
    };

    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  async function sendStatusApiCall(e: any) {
    e.preventDefault();

    if (loading) return;

    if (files.length === 0) {
      toast.error("Please select a media file to post a status.");
      return;
    }

    const formData = new FormData();

    if (status_text) {
      formData.append("status_text", status_text);
    }

    files.forEach((file) => {
      formData.append("files", file);
    });

    const res = await postData("add-status", formData, "multipart/form-data");

    if (res?.success) {
      toast.success("Status posted successfully!");
      dispatch(updateAddStatus({ status_text: "", files: [] }));
      dispatch(updateViewState({ showAddStatusModal: false }));
      refetchStatusList();
    } else {
      toast.error("Failed to post status.");
    }
  }

  return (
    <div className="absolute bottom-24 z-[9999] flex items-center gap-2 rounded-full p-2 ">
      <div
        className={`${
          location.pathname !== "/video-call" &&
          location.pathname !== "/status" &&
          "absolute"
        } flex w-full lg:min-w-[24rem] -translate-y-12 items-center justify-center transition-all duration-300 md:translate-y-0`}
      >
        <div className="flex w-[90%] items-center gap-3 xl:w-[100%]">
          <div
            className={`relative flex h-12 w-full gap-2 rounded-xl border bg-secondary ${
              theme === "dark" ? "border-[#EEEEEE14]" : "border-[#B0B0B0]"
            }`}
          >
            <EmojiPickerCompo />
            <form className="w-full">
              <input
                value={status_text}
                onChange={(e) =>
                  dispatch(
                    updateAddStatus({ status_text: e.target.value, files }),
                  )
                }
                type="text"
                className="h-full w-full bg-transparent px-2 text-sm placeholder-lightText outline-none"
                placeholder="Write a caption for your status"
              />
            </form>
          </div>

          <div
            onClick={sendStatusApiCall}
            className="primary-gradient grid h-11 min-w-12 cursor-pointer place-content-center rounded-xl"
          >
            {loading ? (
              <ClipLoader size={25} />
            ) : (
              <VscSend className="-rotate-45 text-xl" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
