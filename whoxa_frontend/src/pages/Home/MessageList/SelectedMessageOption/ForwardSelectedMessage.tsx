import { RxCross2 } from "react-icons/rx";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks";
import { updateMessageOptions } from "../../../../store/Slices/MessageOptionsSlice";
import TextTranslate from "../../../../utils/TextTranslate";

export default function ForwardSelectedMessage() {
  let MessageOptions = useAppSelector((state) => state.MessageOptions);
  let dispatch = useAppDispatch();

  return (
    // <div className="absolute flex w-full items-center justify-center bg-primary">
    //   <div className="flex w-[90%] items-center justify-between gap-3">
    <div className="flex h-20 w-full items-center justify-between bg-messageHead px-10 pb-[1.3rem] xl:px-20">
      <div className="flex items-center gap-3">
        <RxCross2
          onClick={() => {
            dispatch(
              updateMessageOptions({
                message_list: [],
                forward_message: false,
                selectMessage: false,
              }),
            );
          }}
          className="cursor-pointer text-xl"
        />
        <div>{MessageOptions.message_list?.length} messages</div>
      </div>
      <button
        onClick={() => {
          dispatch(
            updateMessageOptions({
              show_forward_message_modal: true,
            }),
          );
        }}
        className={
          "relative min-h-10 w-fit overflow-hidden rounded-lg !bg-[#FCC604] px-4 text-base text-black outline-none lg:px-9 lg:text-lg"
        }
      >
        <TextTranslate text="Forward To" />
      </button>
    </div>
  );
}
