import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import TextTranslate from "../../../utils/TextTranslate";

interface LogoutModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function LogoutModal({ isOpen, setIsOpen }: LogoutModalProps) {
  let navigate = useNavigate();

  function close() {
    setIsOpen(false);
  }

  function yesLogout() {
    setIsOpen(false);
    Cookies.remove("whoxa_auth_token");
    sessionStorage.clear();
    localStorage.clear();
    navigate("/login");
  }

  return (
    <>
      <Dialog open={isOpen} as="div" className="relative z-10" onClose={close}>
        <div className="fixed inset-0 z-10 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="data-[closed]:transform-[scale(95%)] w-full max-w-md rounded-xl bg-modalBg p-6 shadow-[rgba(17,_17,_26,_0.3)_0px_0px_16px] backdrop-blur-md transition-all duration-300 ease-in-out data-[closed]:opacity-0"
            >
              <DialogTitle as="h3" className="text-xl font-medium">
                <TextTranslate text="Are you sure you want to logout?" />
              </DialogTitle>
              <p className="mt-2 text-sm opacity-70">
                <TextTranslate text="Are you sure you want to logout this account from this Device" />
              </p>
              <div className="ml-auto mr-0 mt-10 flex w-[70%] gap-3">
                <button
                  onClick={close}
                  className={`relative h-11 w-full overflow-hidden rounded-lg border border-[#FFEDAB] !bg-transparent px-4 py-2 text-base outline-none lg:px-9 lg:text-lg`}
                >
                  <span className="">
                    <TextTranslate text="Cancel" />
                  </span>
                </button>
                <Button
                  onClickFunc={() => {
                    yesLogout()
                  }}
                  className={"!h-11"}
                  text={<TextTranslate text="Logout" />}
                />
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
