import { NavLink } from "react-router-dom";
import TextTranslate from "../../../utils/TextTranslate";

export default function EmptyChatScreen() {
  return (
    <div className="hidden h-full w-full place-content-center overflow-hidden lg:grid">
      <img
        className="h-96 w-96 object-cover"
        src="/Home/empty_screen.png"
        alt=""
      />
      <div className="text-center">
        <div>
          <TextTranslate text="Start a new chat with your favorite one and" />
        </div>
        <div>
          <TextTranslate text="make every moment count." />
        </div>
      </div>
      <NavLink to={"/contact-list"} className="mx-auto cursor-pointer">
        <button className="primary-gradient mx-auto mt-6 w-fit rounded-xl px-5 py-2 font-bold shadow-xl">
          <TextTranslate text="Start New Chat" />
        </button>
      </NavLink>
    </div>
  );
}
