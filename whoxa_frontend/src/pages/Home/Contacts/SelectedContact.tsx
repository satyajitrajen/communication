import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { useContactList } from "../../../store/api/useContactList";
import { RxCross2 } from "react-icons/rx";
import {
  addOrRemoveUserId,
  addUserId,
} from "../../../store/Slices/CreateGroupSlice";

export default function SelectedContact() {
  let CreateGroup = useAppSelector((state) => state.CreateGroup);
  let userData = useAppSelector((state) => state.userData);

  let { data: contactListUser } = useContactList({});
  // console.log(contactListUser,"contactListUser ++++++++++++++");

  let dispatch = useAppDispatch();

  useEffect(() => {
    if (userData.user_id == 0) {
      return;
    }

    dispatch(
      addUserId({
        user_id: userData.user_id,
      }),
    );
  }, [userData]);
  console.log(CreateGroup.user_id,"CreateGroup.user_id.length");

  return (
    <>
      {CreateGroup.user_id.length !== 0 && (
        <>
          <div className="flex min-h-28 items-center gap-2 overflow-hidden overflow-x-auto px-3 py-3 text-center lg:max-w-96 2xl:max-w-96">
            {contactListUser?.myContactList
              .filter((contact) =>
                CreateGroup.user_id.includes(contact?.userDetails?.user_id),
              )
              .map((e) => {
                return (
                  <div
                    key={e.userDetails.user_id}
                    className="flex w-24 shrink-0 flex-col items-center gap-2 overflow-hidden"
                  >
                    <div className="relative">
                      <img
                        className="h-10 w-10 rounded-full object-cover xl:h-12 xl:w-12"
                        src={e.userDetails.profile_image} // You can replace this with e.userDetails.profile_image
                        alt=""
                      />
                      {userData.user_id != e.userDetails.user_id && (
                        <RxCross2
                          onClick={() => {
                            dispatch(
                              addOrRemoveUserId({
                                user_id: e.userDetails.user_id,
                              }),
                            );
                          }}
                          className="absolute -right-2 -top-0 z-30 h-5 w-5 cursor-pointer rounded-full bg-[#FCC604] text-black"
                        />
                      )}
                    </div>
                    <div className="text-xs">
                      {userData.user_id == e.userDetails.user_id
                        ? "You"
                        : e?.full_name}
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}
    </>
  );
}
