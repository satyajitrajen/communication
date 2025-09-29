import { FiPlus } from "react-icons/fi";
import { useFile } from "../../../context/FileProvider";
import { useEffect, useState } from "react";

export default function GroupProfileImage() {
  const { selectedFile, setSelectedFile } = useFile();
  const [selectedFileUrl, setSelectedFileUrl] = useState("");

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(null);
    const files = event.target.files![0];
    if (!files) return;
    setSelectedFile(files);
  };

  useEffect(() => {
    if (selectedFile) {
      setSelectedFileUrl(URL.createObjectURL(selectedFile));
    }
  }, [selectedFile]);

  return (
    <div className="grid pt-14 lg:pt-3 w-full place-content-center">
      <label
        htmlFor="groupPhotoInput"
        className="relative mx-auto w-fit cursor-pointer"
      >
        {selectedFile == null ? (
          <img
            src={"/Home/empty_group_profile.png"}
            className="rounded-full bg-secondary object-cover p-2 h-32 w-32"
            alt=""
          />
        ) : (
          <img
            src={selectedFileUrl}
            className="rounded-full bg-secondary object-cover p-2 h-32 w-32"
            alt=""
          />
        )}
        <input
          onChange={onFileChange}
          accept="image/*"
          className="hidden"
          type="file"
          id="groupPhotoInput"
        />
        {selectedFile == null && (
          <div className="absolute top-0 flex flex-col items-center justify-center text-center text-sm h-32 w-32">
            <div className="mb-2 grid h-8 w-8 place-content-center rounded-full bg-[#9E9E9E]">
              <FiPlus className="h-7 w-7" />
            </div>
            <div>Add Group</div>
            <div>Icon</div>
          </div>
        )}
      </label>
    </div>
  );
}
