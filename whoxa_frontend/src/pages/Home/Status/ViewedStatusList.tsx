import { formatRelativeTime } from "../../../utils/formatUTCtoLocalDate";
import { useAppSelector } from "../../../utils/hooks";
import StatusProfile from "./StatusProfile";

export default function ViewedStatusList() {
  const statusData = useAppSelector((state) => state.status);
const userData = useAppSelector((state) => state.userData);

  return (
    <>
      <div className="my-3 flex w-full flex-col overflow-y-auto overflow-x-hidden px-4">
        {statusData?.viewedStatusList.filter((item) => item.userData.user_id !== userData.user_id).length == 0 ? (
          <div className="grid h-96 place-content-center gap-5">
            <img
              className="mx-auto h-16 w-16"
              src="/LightIcons/no_search_result_found.png"
              alt=""
            />
            <div>No Status Found</div>
          </div>
        ) : (
          statusData?.viewedStatusList.filter((item) => item.userData.user_id !== userData.user_id).map((item, idx) => (
            <>
              <StatusProfile
                name={item.full_name}
                profile_url={item.userData.profile_image}
                time={formatRelativeTime(item.userData.Statuses[0].updatedAt)}
                currentStatusId={item.userData.Statuses[0].status_id}
              />
              <hr className="border-t border-borderColor" />
            </>
          ))
        )}
      </div>
    </>
  );
}
