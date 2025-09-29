import { useRef } from "react";
import { FaPlus } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks";

// Redux slice actions
import { updateViewState } from "../../../../store/Slices/ViewManagerSlice";
import { updateAddStatus } from "../../../../store/Slices/AddStatusSlice";
import MyStatusViewer from "./AddStatusViewer";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import toast from "react-hot-toast";

interface MyStatusProps {
  time: string;
  name: string;
  classes?: string;
  currentStatusId: number;
}

export default function MyStatus({
  name,
  time,
  classes,
  currentStatusId,
}: MyStatusProps) {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const statusData = useAppSelector((state) => state.status);
  const userData = useAppSelector((state) => state.userData);
  // Handle clicking on the status container
  function handleStatusClick() {
    if (statusData.myStatus.Statuses.length == 0) {
      return;
    }
    dispatch(
      updateViewState({
        showMyStatusModal: true,
        currentStatusId: currentStatusId,
      }),
    );
  }

  // Handle clicking the + icon to trigger file input
  function handleFileSelectClick(e: React.MouseEvent) {
    e.stopPropagation(); // Prevent click from bubbling to parent div
    fileInputRef.current?.click();
  }

  // Handle file input change and dispatch to Redux slice
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const filesArray = Array.from(selectedFiles);
  
      // filter only images
      const imageFiles = filesArray.filter((file) =>
        file.type.startsWith("image/")
      );
  
      if (imageFiles.length === 0) {
        toast.error("Only image files are allowed for status.");
        return;
      }
  
      dispatch(updateAddStatus({ status_text: "", files: imageFiles }));
      dispatch(
        updateViewState({
          showAddStatusModal: true,
          currentStatusId: currentStatusId,
        })
      );
    }
  }
  return (
    <div className="flex items-center px-3 py-4">
      {/* Profile Image */}

      <img
        onClick={handleStatusClick}
        src={userData.profile_image}
        className={`mr-3 h-10 w-10 cursor-pointer rounded-full object-cover p-1 2xl:h-14 2xl:w-14 ${classes} ${statusData.myStatus.Statuses.length > 0 && "border-2"} `}
        alt="profile"
      />

      {/* Info and Add Button */}
      <div className="flex w-full items-center justify-between">
        {/* Name and Time */}
        <div onClick={handleStatusClick} className="flex cursor-pointer flex-col">
          <div className="text-base font-medium capitalize text-darkText">
            {name}
          </div>
          <div className="flex items-center gap-x-1">
            <div className="line-clamp-1 flex w-full max-w-[12.5rem] gap-x-1 text-[13px] text-lightText">
              <span className="line-clamp-1 w-full">{time}</span>
            </div>
          </div>
        </div>

        {/* + Button to upload status (files) */}
        <div className="flex items-center justify-center gap-2">
          {statusData.myStatus.Statuses.length > 0 && (
            <MdOutlineRemoveRedEye
              onClick={handleStatusClick}
              className="cursor-pointer text-xl"
            />
          )}
          <div
            onClick={handleFileSelectClick}
            className="z-10 grid h-7 w-7 cursor-pointer place-content-center rounded-full bg-otherMessageBg"
          >
            <FaPlus className="rounded-full p-1 text-xl" />
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
