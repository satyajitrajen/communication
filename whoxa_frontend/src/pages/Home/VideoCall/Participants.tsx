import { useAppSelector } from "../../../utils/hooks";

export default function Participants() {
  const ConnectedUser = useAppSelector((state) => state.ConnectedUser);
  // console.log(ConnectedUser, "ConnectedUser");

  return (
    <>
      <div className="flex h-full w-full flex-col gap-y-5 px-5">
        {ConnectedUser.map((user) => {
          return (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-4">
                  <img
                    className="h-10 w-10 rounded-lg object-cover"
                    src={user.profile_image}
                    alt=""
                  />
                  <div className="flex flex-col">
                    <div>{user.first_name}</div>
                    <div className="text-sm text-lightText">
                      {user.user_name}
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-[#FDE693] px-3 py-1 text-black">
                  Joined
                </div>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
}
