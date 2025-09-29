import React from "react";
import { setViewImage } from "../../../store/Slices/ViewManagerSlice";
import { useAppDispatch } from "../../../utils/hooks";
import { useConversationInfo } from "../../../store/api/useConversationInfo";
import { FaPlay } from "react-icons/fa6";
import TextTranslate from "../../../utils/TextTranslate";

export default function Media() {
  let dispatch = useAppDispatch();
  let { data, isLoading } = useConversationInfo();
  const urls = data?.mediaData?.filter((message) => {
    return (
      (message.message_type === "image" || message.message_type === "video") &&
      message.url
    );
  });

  const image_urls = urls?.map((message) => message.url.replace(/\\/g, "/"));
  return (
    <div className="space-y-4">
      {data?.mediaData.length == 0 || data?.mediaData?.length == undefined ? (
        <div className="grid h-96 w-full place-content-center gap-5">
          <img
            className="mx-auto h-16 w-16"
            src="/LightIcons/no_search_result_found.png"
            alt=""
          />
          <div>
            <TextTranslate text="No Media Found!" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {data?.mediaData.map((message, index) => {
            return (
              <>
                {message.message_type == "image" ? (
                  <img
                    onClick={() => {
                      dispatch(
                        setViewImage({
                          show_image: true,
                          image_src: image_urls,
                          currentIndex: index,
                        }),
                      );
                    }}
                    className="h-24 w-full cursor-pointer object-cover"
                    src={
                      message.message_type == "image"
                        ? message.url
                        : message.thumbnail
                    }
                    alt=""
                  />
                ) : (
                  <div
                    onClick={() => {
                      dispatch(
                        setViewImage({
                          show_image: true,
                          image_src: image_urls,
                          currentIndex: index,
                        }),
                      );
                    }}
                    className="relative cursor-pointer"
                  >
                    <div className="absolute grid h-full w-full place-content-center">
                      <FaPlay className="h-11 w-11 rounded-full bg-[#0000008F] p-3 text-white" />
                    </div>
                    <img
                      className="h-24 w-full cursor-pointer object-cover"
                      src={
                        message.message_type == "video"
                          ? message.thumbnail
                          : message.url
                      }
                      alt=""
                    />
                  </div>
                )}
              </>
            );
          })}
        </div>
      )}
      {/* <div className="space-y-3">
        <div className="text-sm capitalize text-[#7F7F7F]">July</div>
        <div className="grid grid-cols-2 gap-1 md:grid-cols-3">
          <div>
            <img
              className="h-[6.5rem] w-full object-cover"
              src="https://images.unsplash.com/photo-1559998817-f908ea15183a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEwfHx8ZW58MHx8fHx8"
              alt=""
            />
          </div>
          <div>
            <img
              className="h-[6.5rem] w-full object-cover"
              src="https://images.unsplash.com/photo-1704813987276-f3f0eee090d2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE1fHx8ZW58MHx8fHx8"
              alt=""
            />
          </div>
          <div>
            <img
              className="h-[6.5rem] w-full object-cover"
              src="https://s3-alpha-sig.figma.com/img/d306/9030/1a135e7703fefdd2c281da27022f03b3?Expires=1724630400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NNgwOpZppNUcX0aEFEy-F0u9MD-r9B1gtsMLL81QSsrhwNrGwqZhAesYBnYjUzSy3QfW-I76E9w1btbmrk2o55ww25aEnrvaD6tuEpKQObcJ5KxnR9BEvySMIrAJ34J4FfOyA-GAcdollX1UxKs9OqvKtnySvVS78oujPcJJ2Y1EN9STsngYs23~q7zfusneo~ZKaP30bleWg3HifI3rzbOJ~VY8M9EXKzS687Ps7ToYcaYStZt3pH1FAXC-f5OrElkCBOQInVRt~re~5Ssn4RXlr45qMagMnnJJRSBxRaVZWzfvXpu8-CGhNsqVUZFxkEY~AHruIrIb~fG6g96LOQ__"
              alt=""
            />
          </div>
          <div>
            <img
              className="h-[6.5rem] w-full object-cover"
              src="https://s3-alpha-sig.figma.com/img/d306/9030/1a135e7703fefdd2c281da27022f03b3?Expires=1724630400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NNgwOpZppNUcX0aEFEy-F0u9MD-r9B1gtsMLL81QSsrhwNrGwqZhAesYBnYjUzSy3QfW-I76E9w1btbmrk2o55ww25aEnrvaD6tuEpKQObcJ5KxnR9BEvySMIrAJ34J4FfOyA-GAcdollX1UxKs9OqvKtnySvVS78oujPcJJ2Y1EN9STsngYs23~q7zfusneo~ZKaP30bleWg3HifI3rzbOJ~VY8M9EXKzS687Ps7ToYcaYStZt3pH1FAXC-f5OrElkCBOQInVRt~re~5Ssn4RXlr45qMagMnnJJRSBxRaVZWzfvXpu8-CGhNsqVUZFxkEY~AHruIrIb~fG6g96LOQ__"
              alt=""
            />
          </div>
          <div>
            <img
              className="h-[6.5rem] w-full object-cover"
              src="https://s3-alpha-sig.figma.com/img/ee6b/6d5c/53ef922283338025cdca83d6b46a8596?Expires=1724630400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=AgfBOtHQmhOWk1AcdhyKR~MRAyt2IK2oSAMlvk50VQtqCLa6t9JYsuEiXepUKBcvX91jwMUnlUZHptG~Lj0h4Ck9kvw~W49yY4M-DPLf4~2Hea6hZbSA~CiKfg-rVcbkUuN4ZaTYASEO~mvALNq8Ekh1qNMP0OGbIoLpdv7R24yzYWcgkAXPFM9pxCv6SXDE1dVWuzgt6LmEL7zD0x6u1bBSCOpf4gTagvAWffhh1h~9lCE3-TaEO2DWlxxZzgQ-hRryFsD19bGLBdkrGdv8P50V6qzQa9UMbuSTxozGImwLCitOLKfo9mhsVx9b6DbKBH~uXHJnLNWJdJmYaq4RRQ__"
              alt=""
            />
          </div>
          <div>
            <img
              className="h-[6.5rem] w-full object-cover"
              src="https://images.unsplash.com/photo-1559998817-f908ea15183a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEwfHx8ZW58MHx8fHx8"
              alt=""
            />
          </div>
        </div>
      </div> */}
    </div>
  );
}
