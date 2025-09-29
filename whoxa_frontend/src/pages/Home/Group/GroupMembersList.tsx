import { useAppSelector, useAppDispatch } from "../../../utils/hooks";
import LoadingSkeletonImageDynamic from "../../../components/LoadingSkeletonImageDynamic";
import { MdCancel } from "react-icons/md";
import { addOrRemoveUserId } from "../../../store/Slices/CreateGroupSlice";
import { useContactList } from "../../../store/api/useContactList";

export default function GroupMembersList() {
  let CreateGroup = useAppSelector((state) => state.CreateGroup);
  let OnlineUserList = useAppSelector((state) => state.OnlineUserList);
  const dispatch = useAppDispatch();
  let { data: contactListUser, isLoading } = useContactList({});
  return (
    <div className="relative mb-28 flex w-full max-w-full flex-col overflow-x-hidden lg:h-[80dvh]">
      {contactListUser?.myContactList
        .filter((contact) =>
          CreateGroup.user_id.includes(contact?.userDetails?.user_id),
        )
        .map((e: any) => {
          return (
            <>
              <div className="flex cursor-pointer items-center px-3 py-4">
                <div className="relative mr-3 h-14 w-14 2xl:h-12 2xl:w-12">
                  <LoadingSkeletonImageDynamic
                    radius=""
                    className="h-10 min-w-10 rounded-full object-cover 2xl:h-12 2xl:w-12"
                    image_height="100%"
                    image_url={e?.userDetails?.profile_image}
                    image_width=""
                  />
                  {OnlineUserList.onlineUserList.includes(
                    e.userDetails.user_id.toString(),
                  ) && (
                    <img
                      className="absolute bottom-0 right-0 z-30 h-4 w-4"
                      src="/Home/Online_Green_dot.png"
                      alt=""
                    />
                  )}
                </div>
                <div>
                  <div className="text-base font-medium capitalize text-darkText">
                    {e?.full_name}
                  </div>
                  <div className="line-clamp-1 flex w-full max-w-[12.5rem] gap-x-1 text-[13px] text-lightText">
                    {e?.userDetails?.user_name}
                  </div>
                </div>
                <div className="ml-auto grid h-full grid-cols-1 place-content-center gap-y-2 text-center">
                  <MdCancel
                    onClick={() => {
                      dispatch(
                        addOrRemoveUserId({
                          user_id: e.userDetails.user_id,
                        }),
                      );
                    }}
                    className="h-5 w-5 text-[#FCC604]"
                  />
                </div>
              </div>
              <hr className="border-t border-borderColor" />
            </>
          );
        })}
    </div>
  );
}
