import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import useApiPost from "../../../hooks/PostData";
import { TermsAndConditionRes } from "../../../types/ResType";
// import LandingNavbar from "../LandingPage/LandingNavbar";

export default function TermsAndCondition() {
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [termsAndConditionLink, setTermsAndConditionLink] = useState("");
  let path = useLocation();

  const { loading, postData } = useApiPost();

  async function fetchTermsAndCondition() {
    let response: TermsAndConditionRes = await postData("get-tncs", {});
    setTermsAndConditionLink(response.TandCs[0].Link);
  }

  useEffect(() => {
    fetchTermsAndCondition();
  }, []);

  const handleIframeLoad = () => {
    setIsIframeLoaded(true);
  };

  return (
    <>
      {/* {path.pathname == "/privacy-policy" && <LandingNavbar />} */}
      {!isIframeLoaded && (
        <div className="flex h-screen items-center justify-center bg-white text-black">
          <ClipLoader color="black" size={30} />
        </div>
      )}

      <div
        style={{ display: isIframeLoaded ? "block" : "none" }}
        className={`font-LimerickRegular scrolling-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-white scrollbar-thumb-rounded-full mx-auto flex h-screen min-h-[50rem] w-screen snap-x snap-mandatory flex-col items-center justify-start overflow-auto overflow-y-auto overflow-x-hidden bg-white pt-20 lg:px-0 xl:my-auto`}
      >
        <iframe
          srcDoc={termsAndConditionLink}
          width="100%"
          height="100%"
          sandbox="allow-same-origin allow-scripts allow-popups"
          onLoad={handleIframeLoad}
        ></iframe>
      </div>
    </>
  );
}
