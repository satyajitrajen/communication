import React from "react";
import LoadingSkeletonImageDynamic from "../../../components/LoadingSkeletonImageDynamic";
import { FaAngleRight, FaPlay } from "react-icons/fa6";
import { useAppDispatch } from "../../../utils/hooks";
import {
  setViewImage,
  updateViewState,
} from "../../../store/Slices/ViewManagerSlice";
import { useConversationInfo } from "../../../store/api/useConversationInfo";
import LinkPreviewForSidebar from "../../../components/LinkPreviewForSidebar";

export default function LinksAndMedia() {
  const dispatch = useAppDispatch();
  const { data } = useConversationInfo();

  // Prepare separate arrays
  const media = data?.mediaData || [];
  const links = data?.linkData || [];
  const docs = data?.documentData || [];

  // Priority logic: media -> links -> documents
  const items: any[] = [];

  // Add media first
  media.slice(0, 3).forEach((m) => items.push({ type: "media", data: m }));

  // If still less than 3, add links
  if (items.length < 3) {
    links
      .slice(0, 3 - items.length)
      .forEach((l) => items.push({ type: "link", data: l }));
  }

  // If still less than 3, add docs
  if (items.length < 3) {
    docs
      .slice(0, 3 - items.length)
      .forEach((d) => items.push({ type: "doc", data: d }));
  }

  const image_urls = media?.map((m) => m.url.replace(/\\/g, "/"));

  return (
    <div className="flex flex-col border border-borderColor bg-otherProfileSidebar px-10 py-2 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
      <div
        onClick={() => {
          dispatch(updateViewState({ showMediaDocLinks: true }));
        }}
        className="flex cursor-pointer items-center justify-between text-sm text-[#959595]"
      >
        <span>Media, links and docs</span>
        <div className="flex items-center gap-1">
          <span>
            {(data?.mediaData?.length || 0) +
              (data?.documentData?.length || 0) +
              (data?.linkData?.length || 0)}
          </span>
          <FaAngleRight />
        </div>
      </div>

      <div
        className={`${
          items.length > 0 && "mt-2"
        } grid grid-cols-2 gap-1 md:grid-cols-3`}
      >
        {items.map((item, index) => {
          if (item.type === "media") {
            const message = item.data;
            return message.message_type === "image" ? (
              <div
                key={index}
                className="h-24 w-full rounded-lg"
                onClick={() => {
                  dispatch(
                    setViewImage({
                      show_image: true,
                      image_src: image_urls,
                      currentIndex: index,
                    }),
                  );
                }}
              >
                <LoadingSkeletonImageDynamic
                  radius=""
                  className="h-24 w-full cursor-pointer rounded-lg object-cover"
                  image_height="100%"
                  image_url={
                    message.message_type === "image"
                      ? message.url
                      : message.thumbnail
                  }
                  image_width=""
                />
              </div>
            ) : (
              <div
                key={index}
                onClick={() => {
                  dispatch(
                    setViewImage({
                      show_image: true,
                      image_src: image_urls,
                      currentIndex: index,
                    }),
                  );
                }}
                className="relative cursor-pointer rounded-lg"
              >
                <div className="absolute grid h-full w-full place-content-center">
                  <FaPlay className="h-11 w-11 rounded-full bg-[#0000008F] p-3" />
                </div>
                <img
                  className="h-24 w-full cursor-pointer rounded-lg object-cover"
                  src={
                    message.message_type === "video"
                      ? message.thumbnail
                      : message.url
                  }
                  alt=""
                />
              </div>
            );
          }

          if (item.type === "link") {
            return (
              <LinkPreviewForSidebar
                key={index}
                url={item.data.message}
                right={false}
              />
            );
          }

          if (item.type === "doc") {
            return (
              <a
                key={index}
                href={item.data.url}
                target="_blank"
                className="grid h-24 w-full place-content-center rounded-lg bg-secondary"
              >
                <div className="flex items-center gap-2">
                  <img
                    className="h-10 w-10 object-cover"
                    src="/DarkIcons/pdf_icons.png"
                    alt=""
                  />
                </div>
              </a>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
