import { updateViewState } from "../../../store/Slices/ViewManagerSlice";
import { useAppDispatch } from "../../../utils/hooks";

interface StatusProfileProps {
  profile_url: string;
  time: string;
  name: string;
  classes?: string;
}

export default function StatusProfile({
  name,
  profile_url,
  time,
  classes,
  currentStatusId,
}: StatusProfileProps & { currentStatusId: number }) {
  const dispatch = useAppDispatch();

  function handleStatusClick() {
    dispatch(updateViewState({ showStatusModal: true, currentStatusId: currentStatusId }));
  }

  return (
    <div
      onClick={handleStatusClick}
      className="flex cursor-pointer items-center px-3 py-4"
    >
      <img
        src={profile_url}
        className={`mr-3 h-10 w-10 rounded-full border-2 object-cover p-1 2xl:h-14 2xl:w-14 ${classes}`}
        alt=""
      />
      <div>
        <div className="text-base font-medium capitalize text-darkText">
          {name}
        </div>
        <div className="flex items-center gap-x-1">
          <div className="line-clamp-1 flex w-full max-w-[12.5rem] gap-x-1 text-[13px] text-lightText">
            <span className="line-clamp-1 w-full">{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

