import React, { useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { RxCross2, RxRadiobutton } from "react-icons/rx";
import { useTheme } from "../../../context/ThemeProvider";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import TextTranslate from "../../../utils/TextTranslate";
import { updateViewState } from "../../../store/Slices/ViewManagerSlice";
import { useFetchLanguageList } from "../../../store/api/useFetchLanguageList";
import Cookies from "js-cookie";

const SelectLanguageModal: React.FC = () => {
  const dispatch = useAppDispatch();
  let { data: languageListRes } = useFetchLanguageList();
  const [status_id, setStatus_id] = useState(1);

  // @ts-ignore
  const { theme } = useTheme();

  const handleCloseModal = () => {
    dispatch(
      updateViewState({
        show_select_language_modal: false,
      }),
    );
  };
  useEffect(() => {
    let tempStatus_id = Cookies.get("status_id");
    if (tempStatus_id) {
      setStatus_id(Number(tempStatus_id));
    } else {
      setStatus_id(1);
    }
  }, []);

  const ViewManager = useAppSelector((state) => state.ViewManager);

  return (
    <Dialog
      open={ViewManager.show_select_language_modal}
      onClose={() => {}}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/35 backdrop-blur-sm">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="relative max-h-[80vh] w-full max-w-sm overflow-hidden rounded-xl bg-primary transition-transform duration-300 ease-out">
            <DialogTitle
              as="h3"
              style={{
                backgroundSize: "100%",
              }}
              className="w-full space-y-5 bg-[url('/Home/add_member_bg.png')] bg-no-repeat px-4 xl:space-y-7"
            >
              <div className="flex items-center gap-3 py-7 font-semibold ">
                <RxCross2
                  onClick={handleCloseModal}
                  className="cursor-pointer text-2xl"
                />
                <span className="">
                  <TextTranslate text="Language" />
                </span>
              </div>
            </DialogTitle>

            <div className="relative mx-4 mt-2 h-fit pb-5">
              {/* <div className="flex justify-between pb-2">
                <div>
                  <TextTranslate text="Select your about" />
                </div>
              </div> */}
              <div className="my-4 max-h-96 divide-y divide-borderColor overflow-auto rounded-lg border border-borderColor">
                {languageListRes?.languages
                  .filter((language) => language.status == true)
                  .map((e) => {
                    return (
                      <div
                        onClick={() => {
                          setStatus_id(e.status_id);
                        }}
                        className="flex cursor-pointer items-center px-4"
                      >
                        {e.status_id == status_id ? (
                          <div className="w-3">
                            <RxRadiobutton className="text-lg text-[#FDCF29]" />
                          </div>
                        ) : (
                          <div className="w-3"></div>
                        )}
                        <div className="px-5 py-3">{e.language}</div>
                      </div>
                    );
                  })}
              </div>
              <div className="flex">
                <button
                  onClick={() => {
                    Cookies.set("status_id", status_id);
                    location.reload();
                  }}
                  className={`primary-gradient relative mx-auto h-9 w-44 rounded-lg px-4 py-2 text-base font-medium outline-none lg:px-9`}
                >
                  <span className="">Save</span>
                </button>
              </div>
              {/* <Button
                onClickFunc={() => {
                  Cookies.set("status_id", status_id);
                }}
                className={""}
                text={<TextTranslate text="Save" />}
              /> */}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default SelectLanguageModal;
