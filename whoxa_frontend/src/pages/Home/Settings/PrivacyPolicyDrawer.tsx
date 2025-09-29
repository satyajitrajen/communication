import { RxCross2 } from "react-icons/rx";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { updateViewState } from "../../../store/Slices/ViewManagerSlice";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsAndCondition from "./TermsAndCondition";


export default function PrivacyPolicyDrawer() {
  const viewImageSlice = useAppSelector((state) => state.ViewManager);
  const dispatch = useAppDispatch();


  return (
    <div
      className={`ml-2 h-full w-[90vw] max-w-[100vw] xl:w-[95vw] ${
        viewImageSlice?.showPrivacyPolicy ||
        viewImageSlice?.showTermsAndCondition
          ? "translate-x-0"
          : "translate-x-[95vw]"
      } scrolling-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-[#EAEFF5] scrollbar-thumb-rounded-full fixed right-0 top-0 z-20 mx-auto flex h-screen min-h-[40rem] max-w-[100vw] snap-x snap-mandatory flex-col overflow-auto overflow-y-auto overflow-x-hidden bg-secondary transition-all duration-700`}
    >
      <div className="flex items-center gap-3 bg-primary px-4 py-7 font-semibold">
        <RxCross2
          className="cursor-pointer text-xl"
          onClick={() => {
            dispatch(
              updateViewState({
                showTermsAndCondition: false,
                showPrivacyPolicy: false,
              }),
            );
          }}
        />
        <span className="">
          {viewImageSlice.showPrivacyPolicy
            ? "Privacy Policy"
            : "Terms & Condition"}
        </span>
      </div>

      {viewImageSlice.showPrivacyPolicy ? (
        <PrivacyPolicy />
      ) : (
        <TermsAndCondition />
      )}
    </div>
  );
}
