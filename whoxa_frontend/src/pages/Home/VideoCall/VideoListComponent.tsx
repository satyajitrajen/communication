import React from "react";
import VideoGrid from "./VideoGrid";
import MainVideo from "./MainVideo";

export default function VideoListComponent() {
  return (
    <div className="w-full lg:w-[75%] h-screen max-h-screen space-y-5 ">
      <VideoGrid />
      <MainVideo />
    </div>
  );
}
