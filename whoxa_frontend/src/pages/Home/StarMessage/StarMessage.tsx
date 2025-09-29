import React from "react";
import { GoChevronLeft } from "react-icons/go";
import { updateViewState } from "../../../store/Slices/ViewManagerSlice";
import { useAppDispatch } from "../../../utils/hooks";
import StarMessageList from "./StarMessageList";
import { useLocation, useNavigate } from "react-router-dom";
import TextTranslate from "../../../utils/TextTranslate";

export default function StarMessage() {
  const dispatch = useAppDispatch();
  const locations = useLocation();
  const navigate = useNavigate();
  return (
    <div className="min-w-80 lg:max-w-96 shadow-inner 2xl:min-w-96">
      <div className="flex items-center gap-3 bg-otherProfileSidebar px-3 py-10">
        <GoChevronLeft
          className="cursor-pointer text-xl"
          onClick={() => {
            // console.log(locations.pathname, "locations.pathname");

            if (locations.pathname == "/star-messages") {
              navigate(-1);
            } else {
              dispatch(updateViewState({ showStarMessageList: false }));
            }
          }}
        />
        <span className="">
          <TextTranslate text="Starred Message" />
        </span>
      </div>

      <StarMessageList />
    </div>
  );
}
