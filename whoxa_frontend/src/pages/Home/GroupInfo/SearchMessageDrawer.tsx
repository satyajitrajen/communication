import { useAppSelector } from "../../../utils/hooks";
import SearchMessage from "../SearchMessage/SearchMessage";

export default function SearchMessageDrawer() {
  const viewImageSlice = useAppSelector((state) => state.ViewManager);

  return (
    <div
      // className={`ml-2 h-full w-96 max-w-[100vw] xl:w-[24rem] ${
      //   viewImageSlice?.showSearchMessage
      //     ? "translate-x-0"
      //     : "translate-x-[26rem]"
      // } scrolling-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-[#EAEFF5] scrollbar-thumb-rounded-full fixed right-0 top-0 z-20 mx-auto flex h-screen min-h-[40rem] max-w-[100vw] snap-x snap-mandatory flex-col overflow-auto overflow-y-auto overflow-x-hidden bg-secondary transition-all duration-500`}
      className={`h-full w-full max-w-[100vw] lg:w-96 xl:w-[24rem] ${
        viewImageSlice?.showSearchMessage ? "translate-x-0" : "translate-x-full"
      } scrolling-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-[#EAEFF5] scrollbar-thumb-rounded-full fixed right-0 top-0 z-20 mx-auto flex h-screen min-h-[40rem] max-w-[100vw] snap-x snap-mandatory flex-col overflow-auto overflow-y-auto overflow-x-hidden bg-secondary transition-all duration-500`}
    >
      <SearchMessage />
    </div>
  );
}
