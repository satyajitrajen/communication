import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import Button from "../../../components/Button";
import TextTranslate from "../../../utils/TextTranslate";
import { updateMessageOptions } from "../../../store/Slices/MessageOptionsSlice";
import useApiPost from "../../../hooks/PostData";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import SearchLocationDropdown from "./SearchLocationDropdown";

export default function SendLocationModal() {
  const dispatch = useAppDispatch();
  const MessageOptionsData = useAppSelector((state) => state.MessageOptions);

  const close = () => {
    dispatch(updateMessageOptions({ show_send_location_modal: false }));
  };

  return (
    <Dialog
      open={MessageOptionsData.show_send_location_modal}
      as="div"
      className="relative z-10"
      onClose={close}
    >
      <div className="fixed inset-0 z-10 flex min-h-full items-center justify-center p-4 backdrop-blur-sm">
        <DialogPanel className="data-[closed]:transform-[scale(95%)] max-h-[80vh] w-full max-w-lg rounded-xl bg-modalBg overflow-hidden shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out data-[closed]:opacity-0">
          <SearchLocationDropdown />
        </DialogPanel>
      </div>
    </Dialog>
  );
}
