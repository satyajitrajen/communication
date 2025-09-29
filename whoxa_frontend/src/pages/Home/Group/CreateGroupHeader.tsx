import { FaChevronLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function CreateGroupHeader() {
  let navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 pt-6 lg:pt-16 font-semibold text-black 2xl:pt-16">
      <FaChevronLeft
        className="cursor-pointer"
        onClick={() => {
          navigate(-1);
        }}
      />
      <span className="">Add Group Icon</span>
    </div>
  );
}
