import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks";
import { updateMessageOptions } from "../../../../store/Slices/MessageOptionsSlice";
import TextTranslate from "../../../../utils/TextTranslate";
import Button from "../../../../components/Button";
import useApiPost from "../../../../hooks/PostData";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { socketInstance } from "../../../../socket/socket";

const pinDurations = [
  { label: "1 day", value: "1_day" },
  { label: "7 days", value: "7_days" },
  { label: "1 Month", value: "1_month" },
  { label: "Lifetime", value: "lifetime" },
];

const SelectedIcon = () => (
  <img
    src="/Home/SelectedOption.png"
    className="max-h-5 max-w-5"
    alt="Selected"
  />
);
const UnselectedIcon = () => (
  <img
    src="/Home/Ellipse 3080.png"
    className="max-h-5 max-w-5"
    alt="Unselected"
  />
);

// @ts-ignore
const PinDurationOption = ({ label, value, isSelected, onSelect }) => (
  <>
    <hr className="border-t border-borderColor" />
    <div
      onClick={onSelect}
      className="flex cursor-pointer items-center justify-between px-6 py-2"
    >
      <div>{label}</div>
      <div>{isSelected ? <SelectedIcon /> : <UnselectedIcon />}</div>
    </div>
  </>
);

export default function PinMessageModal() {
  const dispatch = useAppDispatch();
  const MessageOptionsData = useAppSelector((state) => state.MessageOptions);
  const { loading, postData } = useApiPost();

  const close = () => {
    dispatch(updateMessageOptions({ show_pin_message_modal: false }));
  };
  const handlePinMessage = async () => {
    console.log("Message pinned for:", MessageOptionsData.pinned_duration);
    const message = MessageOptionsData.message_list.map(
      (singleMessage) => singleMessage,
    );
    console.log(
      MessageOptionsData.message_list,
      "MessageOptionsData.message_list",
    );

    await postData("add-to-pin-message", {
      message_id:
        message[MessageOptionsData.message_list.length - 1].message_id,
      conversation_id:
        message[MessageOptionsData.message_list.length - 1].conversation_id,
      duration: MessageOptionsData.pinned_duration,
    });
    toast.success("Message pinned successfully");
    // socketInstance().emit("pinMessageList", {
    //   conversation_id: message[MessageOptionsData.message_list.length - 1].conversation_id,
    // });
    close();
  };

  return (
    <Dialog
      open={MessageOptionsData.show_pin_message_modal}
      as="div"
      className="relative z-10"
      onClose={close}
    >
      <div className="fixed inset-0 z-10 flex min-h-full items-center justify-center p-4 backdrop-blur-sm">
        <DialogPanel className="data-[closed]:transform-[scale(95%)] w-full max-w-sm rounded-xl bg-modalBg py-6 shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out data-[closed]:opacity-0">
          <div className="px-6">
            <DialogTitle as="h3" className="text-xl font-medium">
              <TextTranslate text="Choose how long you want to pin it for?" />
            </DialogTitle>
            <p className="mt-2 text-sm opacity-80">
              <TextTranslate text="Pin messages anytime" />
            </p>
          </div>

          <div className="mt-5 flex flex-col">
            {pinDurations.map(({ label, value }) => (
              <PinDurationOption
                key={value}
                label={label}
                value={value}
                isSelected={MessageOptionsData.pinned_duration === value}
                onSelect={() =>
                  // @ts-ignore
                  dispatch(updateMessageOptions({ pinned_duration: value }))
                }
              />
            ))}
            <hr className="border-t border-borderColor" />
          </div>

          <div className="ml-auto mr-6 mt-10 flex w-[70%] gap-3">
            <button
              onClick={close}
              className="relative h-11 w-full overflow-hidden rounded-lg border border-[#FFEDAB] !bg-transparent px-4 py-2 text-base outline-none lg:px-9 lg:text-lg"
            >
              <TextTranslate text="Cancel" />
            </button>

            {loading ? (
              <button className="primary-gradient relative h-11 w-full overflow-hidden rounded-lg border border-[#FFEDAB] !bg-transparent px-4 py-2 text-base outline-none lg:px-9 lg:text-lg">
                <ClipLoader size={22} />
              </button>
            ) : (
              <Button
                onClickFunc={handlePinMessage}
                className={"!h-11"}
                text={<TextTranslate text="Pin" />}
              />
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
