import React from "react";
import { CiStar } from "react-icons/ci";
import { FaAngleRight } from "react-icons/fa6";
import { updateViewState } from "../../../store/Slices/ViewManagerSlice";
import { useAppDispatch } from "../../../utils/hooks";
import TextTranslate from "../../../utils/TextTranslate";
import { useStarMessageList } from "../../../store/api/useStarMessageList";

export default function StarMessageTab() {
  const dispatch = useAppDispatch();
  const { data: starMessageListData } = useStarMessageList();
  return (
    <>
      <div
        onClick={() => {
          dispatch(updateViewState({ showStarMessageList: true }));
        }}
        className="flex cursor-pointer items-center justify-between border border-borderColor bg-otherProfileSidebar px-10 py-2 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] 2xl:py-3"
      >
        <div className="flex items-center gap-3 text-sm">
          <CiStar className="text-lg" />
          <div className="text-darkText">
            <TextTranslate text="Starred Messages" />
          </div>
        </div>

        <div className="flex items-center">
          <div className="rounded-full bg-primary px-2 py-1 text-sm text-white">
            {starMessageListData?.StarMessageList.length}
          </div>
          <FaAngleRight />
        </div>
      </div>
    </>
  );
}
