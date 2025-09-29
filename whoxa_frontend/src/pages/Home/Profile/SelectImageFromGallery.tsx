import { FaCheckCircle } from "react-icons/fa";
import { useAvtarList } from "../../../store/api/useAvtarList";
import { updateSpesificUserData } from "../../../store/Slices/UserSlice";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import LoadingSkeletonImageDynamic from "../../../components/LoadingSkeletonImageDynamic";
import { useFile } from "../../../context/FileProvider";
import { useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import TextTranslate from "../../../utils/TextTranslate";

export default function SelectImageFromGallery() {
  let { data: avtarData } = useAvtarList();
  const { setSelectedFile } = useFile();
  const [selectedFileUrl, setSelectedFileUrl] = useState("");

  const dispatch = useAppDispatch();
  let userData = useAppSelector((state) => state.userData);

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateSpesificUserData({ avatar_id: 0 }));
    setSelectedFile(null);
    const files = event.target.files![0];
    if (!files) return;
    setSelectedFile(files);
    setSelectedFileUrl(URL.createObjectURL(files));
  };

  return (
    <>
      <div className="space-y-3 rounded-xl border border-borderColor p-4">
        <div className="font-medium">
          <TextTranslate text="Choose From" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="grid place-content-center rounded-full bg-[#FEF6D7]">
            <div
              onClick={() => {
                dispatch(updateSpesificUserData({ avatar_id: 0 }));
              }}
              className={`relative rounded-full ${userData.avatar_id == 0 && "border border-[#FCC604]"} p-1`}
            >
              {selectedFileUrl ? (
                <LoadingSkeletonImageDynamic
                  radius=""
                  className={`object-coverp-2 mx-auto h-20 w-20 rounded-full 2xl:h-28 2xl:w-28`}
                  image_height=""
                  image_url={selectedFileUrl || userData.profile_image}
                  image_width=""
                />
              ) : (
                <label htmlFor="selectProfileImage" className="cursor-pointer">
                  <img
                    className="h-10 w-10"
                    src="/LightIcons/gallery.png"
                    alt=""
                  />
                </label>
              )}
              <input
                onChange={onFileChange}
                accept="image/*"
                className="hidden"
                type="file"
                id="selectProfileImage"
              />
              {userData.avatar_id == 0 && selectedFileUrl && (
                <label
                  htmlFor="selectProfileImage"
                  className="absolute bottom-0 right-0 z-30 grid h-8 w-8 cursor-pointer place-content-center rounded-full"
                >
                  <BiEditAlt className="primary-gradient rounded-full p-1 text-2xl" />
                </label>
              )}
            </div>
          </div>
          <div>
            <TextTranslate text="Your Photos" />
          </div>
        </div>
      </div>
    </>
  );
}
