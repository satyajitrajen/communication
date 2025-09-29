import { AiOutlineCopyright } from "react-icons/ai";
import { BsSend } from "react-icons/bs";
import { FaFacebook, FaInstagram } from "react-icons/fa6";
import { LiaLinkedin } from "react-icons/lia";
import { LuPhoneCall } from "react-icons/lu";
import { MdOutlineEmail } from "react-icons/md";
import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <div className="w-full bg-[#EEEEEE] relative">
      {/* rounded circul icon design */}
      <div>
        <img
          src="/LightIcons/two_line_circle.png"
          className="h-32 w-32 absolute -left-8 top-7"
          alt=""
        />
        <img
          src="/LightIcons/two_line_circle.png"
          className="h-16 w-16 absolute -right-1 top-8"
          alt=""
        />
        <img
          src="/LightIcons/two_line_circle.png"
          className="h-24 w-24 absolute right-52 bottom-7"
          alt=""
        />
      </div>
      <div className=" flex flex-col lg:flex-row  p-10 gap-6 w-full lg:w-[85vw] 2xl:w-[70vw] mx-auto">
        {/* About company ====================================================================================*/}
        <div className="space-y-3 text-xl flex-grow">
          <h3 className="text-2xl font-medium">About Company</h3>
          <div className="bg-newGray h-2 w-20"></div>
          <div>
            <NavLink to={"/"} className={"text-lightDark2"}>
              Our Company
            </NavLink>
          </div>
          <div>
            <NavLink to={"/"} className={"text-lightDark2"}>
              Privacy Policy
            </NavLink>
          </div>
          <div>
            <NavLink to={"/"} className={"text-lightDark2"}>
              Terms & Conditions
            </NavLink>
          </div>
        </div>

        {/* Vehicles Type ====================================================================================*/}
        <div className="space-y-3 text-xl flex-grow">
          <h3 className="text-2xl font-medium">Services Type</h3>
          <div className="bg-newGray h-2 w-20"></div>
          <div>
            <NavLink to={"/"} className={"text-lightDark2"}>
              Plumber
            </NavLink>
          </div>
          <div>
            <NavLink to={"/"} className={"text-lightDark2"}>
              Carpenter
            </NavLink>
          </div>
          <div>
            <NavLink to={"/"} className={"text-lightDark2"}>
              Painter
            </NavLink>
          </div>
          <div>
            <NavLink to={"/"} className={"text-lightDark2"}>
              Electrician
            </NavLink>
          </div>
          <div>
            <NavLink to={"/"} className={"text-blueTextColor underline "}>
              And Many More
            </NavLink>
          </div>
        </div>

        {/* Contact Info ====================================================================================*/}
        <div className="space-y-4 text-xl flex-grow">
          <h3 className="text-2xl font-medium">Contact Info</h3>
          <div className="bg-newGray h-2 w-20"></div>

          <div className="flex items-center gap-x-3">
            <div className="bg-newGray text-darkTextColor h-12 w-12 rounded-md grid place-content-center">
              <a href="tel:+18884571246" className={" "}>
                <LuPhoneCall className="text-2xl" />
              </a>
            </div>
            <a href="tel:+18884571246" className={" "}>
              <span className="">+1(888)457 1246</span>
            </a>
          </div>

          <div className="flex items-center gap-x-3">
            <div className="bg-newGray text-darkTextColor h-12 w-12 rounded-md grid place-content-center">
              <a href="mailto:info@zeroe.com" className={" "}>
                <MdOutlineEmail className="text-2xl" />
              </a>
            </div>
            <a href="mailto:info@zeroe.com" className={" "}>
              <span className="">info@zeroe.com</span>
            </a>
          </div>

          <div className="bg-lightTextColor w-full sm:w-96 h-12 items-center rounded-md flex px-3">
            <MdOutlineEmail className="text-2xl text-[#7C7C7C]" />
            <input
              type="text"
              placeholder="Enter Your Email Here "
              className=" outline-none text-[#7C7C7C] text-lg px-2 h-full w-full"
            />
            <div className="bg-newGray text-darkTextColor h-9 w-12 rounded-md grid place-content-center">
              <BsSend className="text-xl" />
            </div>
          </div>

          <div className="flex flex-col">
            <h5>Connect with us</h5>
            <div className="flex gap-3">
              <div className="bg-[#3180F8] text-lightTextColor h-10 w-10 rounded-full grid place-content-center">
                <NavLink to={"/"} className={" "}>
                  <FaFacebook className="text-2xl" />
                </NavLink>
              </div>
              <div className="bg-[#F20D0D] text-lightTextColor h-10 w-10 rounded-full grid place-content-center">
                <NavLink to={"/"} className={" "}>
                  <FaInstagram className="text-2xl" />
                </NavLink>
              </div>
              <div className="bg-[#379BF8] text-lightTextColor h-10 w-10 rounded-full grid place-content-center">
                <NavLink to={"/"} className={" "}>
                  <LiaLinkedin className="text-3xl" />
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center w-full py-10 flex items-center justify-center gap-2">
        <AiOutlineCopyright />
        <span> 2024 Handyman. All Rights Reserved</span>
      </div>
    </div>
  );
}
