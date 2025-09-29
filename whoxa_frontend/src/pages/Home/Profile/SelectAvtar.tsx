import { FaCheckCircle } from "react-icons/fa";
import { useAvtarList } from "../../../store/api/useAvtarList";
import { updateSpesificUserData } from "../../../store/Slices/UserSlice";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { ClipLoader } from "react-spinners";
import { useTheme } from "../../../context/ThemeProvider";
import TextTranslate from "../../../utils/TextTranslate";

export default function SelectAvtar() {
  let { data: avtarData, isLoading } = useAvtarList();

  const dispatch = useAppDispatch();
  let userData = useAppSelector((state) => state.userData);

  // @ts-ignore
  const { theme } = useTheme();

  return (
    <>
      <div className="space-y-3 rounded-xl border border-borderColor p-4">
        <div className="font-medium">
          <TextTranslate text="Choose Avtar" />
        </div>
        <div className="avtar-containar flex gap-x-3 overflow-x-auto pb-3">
          {isLoading ? (
            <div className="grid h-28 w-full place-content-center">
              <ClipLoader
                size={23}
                color={theme == "dark" ? "white" : "black"}
              />
            </div>
          ) : (
            <>
              {avtarData?.avatars?.map((avtar) => {
                return (
                  <>
                    <div
                      onClick={() => {
                        dispatch(
                          updateSpesificUserData({
                            avatar_id: avtar.avatar_id,
                          }),
                        );
                      }}
                      className={`relative h-28 w-28 shrink-0 cursor-pointer rounded-full ${userData.avatar_id == avtar.avatar_id && "border border-[#FCC604]"} p-1`}
                    >
                      <img
                        className="h-full w-full rounded-full"
                        src={avtar.avtar_Media}
                        alt=""
                      />
                      {userData.avatar_id == avtar.avatar_id && (
                        <label
                          htmlFor="groupPhotoEdit"
                          className="absolute bottom-0 right-0 z-30 grid h-7 w-7 cursor-pointer place-content-center rounded-full bg-white"
                        >
                          <FaCheckCircle className="text-xl text-[#FCC604]" />
                        </label>
                      )}
                    </div>
                  </>
                );
              })}
            </>
          )}
        </div>
      </div>
    </>
  );
}
