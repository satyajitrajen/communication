import { useAppDispatch, useAppSelector } from "../../../../utils/hooks";
import { updateViewState } from "../../../../store/Slices/ViewManagerSlice";
import { updateSendMessageData } from "../../../../store/Slices/SendMessageSlice";
import useApiPost from "../../../../hooks/PostData";
import { useEffect, useState } from "react";
import { StatusViewesRes } from "../../../../types/ResType";
import { HiOutlineEye } from "react-icons/hi";
import { formatDate, formatRelative } from "date-fns";

export default function StatusViewes() {
  const dispatch = useAppDispatch();
  const { showStatusViews } = useAppSelector((state) => state.ViewManager);
  const { postData } = useApiPost();
  const StatusData = useAppSelector((state) => state.status);
  const [statusViews, setStatusViews] = useState<StatusViewesRes>();

  useEffect(() => {
    if (showStatusViews) {
      fetchStatusViews();
    }
  }, [showStatusViews]);

  function close() {
    dispatch(updateViewState({ showStatusViews: false }));
    dispatch(updateSendMessageData({ status_id: 0 }));
  }

  async function fetchStatusViews() {
    const response: StatusViewesRes = await postData("status-view-list", {
      status_id: StatusData.myStatus.Statuses[0]?.status_id,
    });
    setStatusViews(response);
  }

  return (
    <>
      {/* 🧾 Bottom Sheet */}
      {showStatusViews && (
        <div className="absolute bottom-0 left-0 right-0 z-[9999] max-h-[80vh] overflow-hidden rounded-t-2xl bg-secondary p-4 shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between  pb-2">
            <h2 className="text-lg font-semibold text-darkText">Status Views</h2>
            <button onClick={close} className="text-lightText hover:opacity-75">
              Close
            </button>
          </div>

          <div className="custom-scrollbar mt-4 max-h-[40vh] overflow-y-auto pr-2">
            {statusViews?.statusViewsList?.length ? (
              statusViews.statusViewsList.map((item) => (
                <div
                  key={item.status_count}
                  className="flex items-center gap-3 py-2"
                >
                  <img
                    src={item.User.profile_image}
                    className="h-10 w-10 rounded-full object-cover"
                    alt=""
                  />
                  <div className="flex flex-col">
                    <div className="text-sm text-white">
                      {item.User.first_name} {item.User.last_name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatRelative(item.createdAt, new Date())}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-sm text-white">
                No views yet.
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
