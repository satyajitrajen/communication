import { Dialog, DialogPanel } from "@headlessui/react";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks";
import { updateViewState } from "../../../../store/Slices/ViewManagerSlice";
import { mapStatusesGrouped } from "./StatusUtils";
import { StatusViewer } from "./StatusViewer";
import { useStatusList } from "../../../../store/api/useStatusList";
import { updateSendMessageData } from "../../../../store/Slices/SendMessageSlice";
import AddStatusViewer from "../MyStatus/AddStatusViewer";
import MyStatusViewer from "../MyStatus/MyStatusViewer";

export default function StatusModal() {
  const dispatch = useAppDispatch();
  const { showAddStatusModal, showStatusModal, showMyStatusModal } = useAppSelector((state) => state.ViewManager);
  function close() {
    dispatch(updateViewState({ showStatusModal: false }));
    dispatch(
      updateSendMessageData({
        status_id: 0,
      }),
    );
  }
  // const statusData = useAppSelector((state) => state.status);
  const { data } = useStatusList();

  const groupedUsers = mapStatusesGrouped(data!);

  return (
    <>
      <Dialog
        open={showAddStatusModal || showStatusModal || showMyStatusModal}
        onClose={close}
      >
        <div className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-sm">
          <DialogPanel className="w-full max-w-lg rounded-xl p-4">
            {showAddStatusModal && <AddStatusViewer />}
            {showStatusModal && (
              <StatusViewer groupedUsers={groupedUsers} onClose={close} />
            )}
            {showMyStatusModal && <MyStatusViewer />}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
