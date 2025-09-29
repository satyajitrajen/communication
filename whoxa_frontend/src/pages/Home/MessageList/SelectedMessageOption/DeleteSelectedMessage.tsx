import React from "react";
import Button from "../../../../components/Button";
import { RxCross2 } from "react-icons/rx";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks";
import { updateMessageOptions } from "../../../../store/Slices/MessageOptionsSlice";
import { useTranslateText } from "../../../../hooks/useTranslateText";

export default function DeleteSelectedMessage() {
  let MessageOptions = useAppSelector((state) => state.MessageOptions);
  let dispatch = useAppDispatch();
  const translate = useTranslateText();
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
                delete_from_every_one: false,
                delete_message: false,
                selectMessage: false,
              }),
            );
          }}
          className="cursor-pointer text-xl"
        />
        <div>
          {MessageOptions.message_list?.length} {translate("messages")}
        </div>
      </div>
      <button
        onClick={() => {
          dispatch(
            updateMessageOptions({
              showModal: true,
              title: translate("Are you sure you want Delete the message?"),
              description: translate(
                "Choose the option below to clear the message",
              ),
              modalName: "delete_chat",
            }),
          );
        }}
        className={
          "relative h-9 w-fit overflow-hidden rounded-lg !bg-[#FCC604] px-4 text-base text-black outline-none lg:px-9 lg:text-lg"
        }
      >
        {translate("Delete")}
      </button>
    </div>
  );
}
