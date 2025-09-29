import React from "react";

export default function LoginLeftSections() {
  return (
    <div
      className="relative col-span-1 hidden h-full w-full place-content-center rounded-r-[2.5rem] bg-cover bg-center lg:grid"
      style={{
        backgroundImage: `url(${"/Home/signin_bg.jpg"})`,
      }}
    >
      {/* <img
      src="/Home/9dots.png"
      className="hidden 2xl:inline h-28 w-28 absolute bottom-0  object-contain "
      alt=""
    /> */}

      <img
        src="/Home/signin_image.png"
        className="ml-auto mr-auto h-full w-full px-10 xl:w-[70%]"
        alt=""
      />
      <div className="my-10 text-center text-xl font-medium">
        <div>Chat effortlessly with friends and</div>
        <div>family anytime, anywhere!</div>
      </div>

      <div className="text-center font-medium">
        Share photos and chat anytime.
      </div>
    </div>
  );
}
