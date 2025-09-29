import React from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { setViewImage } from "../store/Slices/ViewManagerSlice";
import ReactSlickCarousel from "./ReactSlickCarousel";


const ImageViewer: React.FC = () => {
  const viewImageSlice = useAppSelector((state) => state.ViewManager);
  const dispatch = useAppDispatch();

  const handleCloseModal = () => {
    dispatch(setViewImage({ show_image: false, image_src: [] }));
  };

  return (
    <Dialog
      open={viewImageSlice.show_image}
      onClose={handleCloseModal}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/35 backdrop-blur-sm">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="relative w-full lg:w-[70%] rounded-xl p-3 transition-transform duration-300 ease-out">
            <DialogTitle
              as="h3"
              className="mb-4 flex w-full items-center justify-between text-xl font-medium"
            >
              <span></span>
              <RxCross2
                onClick={handleCloseModal}
                className="cursor-pointer text-2xl"
              />
            </DialogTitle>
            <ReactSlickCarousel />
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ImageViewer;
