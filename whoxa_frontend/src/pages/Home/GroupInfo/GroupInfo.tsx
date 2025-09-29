/* eslint-disable prefer-const */
import { useConversationInfo } from "../../../store/api/useConversationInfo";
import LinksAndMedia from "./LinksAndMedia";
import GroupHeader from "./GroupHeader";
import GroupMembers from "./GroupMembers";
import GroupActions from "./GroupActions";
import StarMessageTab from "./StarMessageTab";
import { RxCross2 } from "react-icons/rx";
import { toggleProfileView } from "../../../store/Slices/ViewManagerSlice";
import { useAppDispatch } from "../../../utils/hooks";
import TextTranslate from "../../../utils/TextTranslate";

export default function GroupInfo() { 
  let { data } = useConversationInfo();
  let dispatch = useAppDispatch();
  return (
    <>
      <div className="absolute z-10 flex w-full items-center gap-3 bg-no-repeat px-3 py-4 font-semibold text-darkText backdrop-blur-lg">
        <RxCross2
          className="cursor-pointer text-2xl"
          onClick={() => {
            dispatch(toggleProfileView(false));
          }}
        />
        <span className="">
          <TextTranslate
            text={
              data?.conversationDetails.is_group == true
                ? "Group Info"
                : "Contact Info"
            }
          />
        </span>
      </div>

      <div className="flex h-screen min-w-72 flex-col overflow-auto bg-secondary shadow-inner 2xl:min-w-96 overflow-x-hidden">
        <GroupHeader />
        <div className="h-full space-y-3">
          {/* About */}
          {!data?.conversationDetails.is_group && (
            <div className="flex flex-col border border-borderColor bg-otherProfileSidebar px-10 py-1 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
              <div className="text-sm text-[#959595]">About</div>
              <div className="font-medium">
                {data?.conversationDetails.ConversationsUsers[0].User.bio}
              </div>
            </div>
          )}

          {/* Links And Media */}
          <LinksAndMedia />

          {/* Star Message */}
          <StarMessageTab />

          {/* Group Members */}
          <GroupMembers />

          {/* Group Actions */}
          <GroupActions />
        </div>
      </div>
    </>
  );
}
