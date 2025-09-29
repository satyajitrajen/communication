import React from "react";
import { IoIosAttach } from "react-icons/io";
import OnClickOutside from "../../../../utils/OnClickOutSide";
import { updateSendMessageData } from "../../../../store/Slices/SendMessageSlice";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks";
import { useFile } from "../../../../context/FileProvider";
import { FaFileAlt } from "react-icons/fa";
import { FaRegFileLines } from "react-icons/fa6";
import { useTheme } from "../../../../context/ThemeProvider";
import toast from "react-hot-toast";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { FiChevronDown } from "react-icons/fi";
import { TiVideo } from "react-icons/ti";
import TextTranslate from "../../../../utils/TextTranslate";
import { updateMessageOptions } from "../../../../store/Slices/MessageOptionsSlice";

export default function SelectFile() {
  const dispatch = useAppDispatch();
  const messageData = useAppSelector((state) => state.SendMessageData);
  const CurrentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );
  const { selectedFile, setSelectedFile } = useFile();
  // @ts-ignore
  const { theme } = useTheme();

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      updateSendMessageData({
        conversation_id: CurrentConversationData.conversation_id,
      }),
    );

    // @ts-ignore
    const fileObj = event.target.files[0];
    const fileSizeInMB = fileObj.size / (1024 * 1024);

    if (fileSizeInMB > 100) {
      // alert("file is greater than 100 MB.");
      toast.error("File size is greater than 100 MB", { duration: 3000 });
      closeAttachMentOption();
      dispatch(
        updateSendMessageData({
          message_type: "",
        }),
      );
      return; // Prevent further processing
    }

    setSelectedFile(null);

    const files = event.target.files![0];
    event.target.value = "";
    if (!files) return; // Handle case where no files are selected
    dispatch(
      updateSendMessageData({
        showAttachmentOptions: false,
      }),
    );

    if (messageData.message_type == "document") {
      dispatch(
        updateSendMessageData({
          fileName: files.name,
        }),
      );
    }
    setSelectedFile(files);
  };

  function closeAttachMentOption() {
    dispatch(
      updateSendMessageData({
        showAttachmentOptions: false,
      }),
    );
  }

  return (
    <>
      <OnClickOutside
        className="my-auto"
        onClickOutside={closeAttachMentOption}
      >
        <Menu>
          <MenuButton className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm/6 font-semibold shadow-2xl focus:outline-none data-[focus]:outline-1">
            <IoIosAttach className="my-auto cursor-pointer text-2xl" />
          </MenuButton>

          <MenuItems
            transition
            anchor="bottom end"
            className="w-[17.2rem]  origin-top-right rounded-xl border border-borderColor text-sm/6 transition duration-200 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            <MenuItem>
              {(
                { close }, // Destructure `close` from context
              ) => (
                <>
                  <div className="grid h-56 w-[17rem] grid-cols-3 gap-5 rounded-lg bg-primary p-4 px-6 text-sm shadow-md">
                    <label
                      onClick={() => {
                        dispatch(
                          updateSendMessageData({
                            message_type: "document",
                          }),
                        );
                        close(); // Close the menu when clicked
                      }}
                      htmlFor="documentInput"
                      className="flex h-fit flex-col items-center gap-2"
                    >
                      <input
                        onChange={onFileChange}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        type="file"
                        id="documentInput"
                      />
                      <div className="grid h-14 w-14 cursor-pointer place-content-center rounded-full bg-attachIconBg transition-all duration-300 hover:opacity-80">
                        <img
                          className="h-7 w-7"
                          src={`${theme == "dark" ? "/AttachIcons/document_dark.png" : "/AttachIcons/document_light.png"} `}
                          alt=""
                        />
                      </div>
                      <div>
                        <TextTranslate text="Document" />
                      </div>
                    </label>
                    <label
                      onClick={() => {
                        dispatch(
                          updateSendMessageData({
                            message_type: "image",
                          }),
                        );
                        close(); // Close the menu when clicked
                      }}
                      htmlFor="photoInput"
                      className="flex h-fit flex-col items-center gap-2"
                    >
                      <input
                        onChange={onFileChange}
                        accept="image/*"
                        className="hidden"
                        type="file"
                        id="photoInput"
                      />

                      <div className="grid h-14 w-14 cursor-pointer place-content-center rounded-full bg-attachIconBg transition-all duration-300 hover:bg-opacity-55 hover:opacity-80">
                        <img
                          className="h-7 w-7"
                          src={`${theme == "dark" ? "/AttachIcons/gallery_dark.png" : "/AttachIcons/gallery_light.png"} `}
                          alt=""
                        />
                      </div>
                      <div>Photo</div>
                    </label>
                    <label
                      onClick={() => {
                        dispatch(
                          updateSendMessageData({
                            message_type: "video",
                          }),
                        );
                        close(); // Close the menu when clicked
                      }}
                      htmlFor="videoInput"
                      className="flex h-fit flex-col items-center gap-2"
                    >
                      <input
                        onAbort={() => {
                          alert("select another file");
                        }}
                        onChange={onFileChange}
                        accept="video/*"
                        className="hidden"
                        type="file"
                        id="videoInput"
                      />

                      <div className="grid h-14 w-14 cursor-pointer place-content-center rounded-full bg-attachIconBg transition-all duration-300 hover:bg-opacity-55 hover:opacity-80">
                        <img
                          className="h-7 w-7"
                          // src="/AttachIcons/video.png"
                          src={`${theme == "dark" ? "/AttachIcons/video_dark.png" : "/AttachIcons/video_light.png"} `}
                          alt=""
                        />
                      </div>
                      <div>
                        <TextTranslate text="Video" />
                      </div>
                    </label>
     
                    <label
                      onClick={() => {
                        dispatch(
                          updateSendMessageData({
                            message_type: "location",
                          }),
                        );
                        dispatch(
                          updateMessageOptions({
                            show_send_location_modal: true,
                          }),
                        );

                        close(); // Close the menu when clicked
                      }}
                      className="flex h-fit flex-col items-center gap-2"
                    >
                      <div className="grid h-14 w-14 cursor-pointer place-content-center rounded-full bg-attachIconBg transition-all duration-300 hover:bg-opacity-55 hover:opacity-80">
                        <img
                          className="h-7 w-7"
                          src={`${theme == "dark" ? "/DarkIcons/location.png" : "/LightIcons/location.png"} `}
                          alt=""
                        />
                      </div>
                      <div>
                        <TextTranslate text="Location" />
                      </div>
                    </label>
                  </div>
                </>
              )}
            </MenuItem>
          </MenuItems>
        </Menu>

        <div
          className={` ${
            messageData.showAttachmentOptions
              ? "visible translate-y-3"
              : "invisible translate-y-20 opacity-0"
          } absolute -right-28 bottom-16 transition-all duration-500 sm:-right-0`}
        >
          <div className="w-70 grid h-28 grid-cols-3 gap-5 rounded-lg bg-primary p-4 px-6 text-sm shadow-md">
            <label
              onClick={() => {
                dispatch(
                  updateSendMessageData({
                    message_type: "document",
                  }),
                );
              }}
              htmlFor="documentInput"
              className="flex h-fit flex-col items-center gap-2"
            >
              <input
                onChange={onFileChange}
                accept=".pdf,.doc,.docx"
                className="hidden"
                type="file"
                id="documentInput"
              />
              <div className="grid h-14 w-14 cursor-pointer place-content-center rounded-full bg-attachIconBg transition-all duration-300 hover:opacity-80">
                <img
                  className="h-7 w-7"
                  src={`${theme == "dark" ? "/AttachIcons/document_dark.png" : "/AttachIcons/document_light.png"} `}
                  alt=""
                />
              </div>
              <div>Document</div>
            </label>
            <label
              onClick={() => {
                dispatch(
                  updateSendMessageData({
                    message_type: "image",
                  }),
                );
              }}
              htmlFor="photoInput"
              className="flex h-fit flex-col items-center gap-2"
            >
              <input
                onChange={onFileChange}
                accept="image/*"
                className="hidden"
                type="file"
                id="photoInput"
              />

              <div className="grid h-14 w-14 cursor-pointer place-content-center rounded-full bg-attachIconBg transition-all duration-300 hover:bg-opacity-55 hover:opacity-80">
                <img
                  className="h-7 w-7"
                  src={`${theme == "dark" ? "/AttachIcons/gallery_dark.png" : "/AttachIcons/gallery_light.png"} `}
                  alt=""
                />
              </div>
              <div>Photo</div>
            </label>
            <label
              onClick={() => {
                dispatch(
                  updateSendMessageData({
                    message_type: "video",
                  }),
                );
              }}
              htmlFor="videoInput"
              className="flex h-fit flex-col items-center gap-2"
            >
              <input
                onChange={onFileChange}
                accept="video/*"
                className="hidden"
                type="file"
                id="videoInput"
              />

              <div className="grid h-14 w-14 cursor-pointer place-content-center rounded-full bg-attachIconBg transition-all duration-300 hover:bg-opacity-55 hover:opacity-80">
                <img
                  className="h-7 w-7"
                  // src="/AttachIcons/video.png"
                  src={`${theme == "dark" ? "/AttachIcons/video_dark.png" : "/AttachIcons/video_light.png"} `}
                  alt=""
                />
              </div>
              <div>Video</div>
            </label>
            {/* <div className="flex h-fit flex-col items-center gap-2">
              <div className="grid h-14 w-14 cursor-pointer place-content-center rounded-full bg-attachIconBg transition-all duration-300 hover:bg-opacity-55 hover:opacity-80">
                <img
                  className="h-7 w-7"
                  src="/AttachIcons/location.png"
                  alt=""
                />
              </div>
              <div>Location</div>
            </div>
            <div className="flex h-fit flex-col items-center gap-2">
              <div className="grid h-14 w-14 cursor-pointer place-content-center rounded-full bg-attachIconBg transition-all duration-300 hover:bg-opacity-55 hover:opacity-80">
                <img
                  className="h-7 w-7"
                  src="/AttachIcons/contact.png"
                  alt=""
                />
              </div>
              <div>Contact</div>
            </div> */}
          </div>
        </div>
      </OnClickOutside>
    </>
  );
}
