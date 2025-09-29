import ReusableProfileCard from "../Profile/ReusableProfileCard";
import { PiUsersThree } from "react-icons/pi";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { updateCreateGroupData } from "../../../store/Slices/CreateGroupSlice";
import { MdCheck } from "react-icons/md";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";

export default function GroupNameInput() {
  const dispatch = useAppDispatch();

  const handleValueChange = (newValue: React.ChangeEvent<HTMLInputElement>) => {
    // Check if the pressed key was Backspace
    if (newValue.nativeEvent.inputType === "deleteContentBackward") {
      dispatch(updateCreateGroupData({ group_name: newValue.target.value }));
      return;
    }

    // If the input length is within the limit, update normally
    if (CreateGroup.group_name.length < CreateGroup.group_name_limit) {
      dispatch(updateCreateGroupData({ group_name: newValue.target.value }));
    } else {
      toast.error(
        `Group Name should only contain ${CreateGroup.group_name_limit} letters`,
        { position: "bottom-left" },
      );
    }
  };

  let CreateGroup = useAppSelector((state) => state.CreateGroup);

  return (
    <div className="flex flex-col gap-3">
      {/* <ReusableProfileCard
        icon={}
        value="Group Name"
        onChange={handleValueChange}
      /> */}
      <div className="flex cursor-pointer items-center justify-between rounded-lg border border-borderColor px-5 py-2 2xl:py-3">
        <div className="flex items-center gap-3">
          <PiUsersThree className="text-2xl" />
          {true ? (
            <input
              type="text"
              value={CreateGroup.group_name}
              onChange={handleValueChange}
              // onBlur={() => setIsEditing(false)}
              className="border-none bg-transparent outline-none"
            />
          ) : (
            <div>{CreateGroup.group_name}</div>
          )}
        </div>
        {CreateGroup.group_name.length >= CreateGroup.group_name_limit ||
        CreateGroup.group_name.length == 0 ? (
          <RxCross2 className="text-lg text-red-500" />
        ) : (
          <>
            <MdCheck className="text-lg text-green-500" />
          </>
        )}
      </div>
      <div className="self-end text-sm">
        {CreateGroup.group_name.length}/{CreateGroup.group_name_limit}
      </div>
    </div>
  );
}
