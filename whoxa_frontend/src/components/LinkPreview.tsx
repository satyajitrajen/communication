import React, { useState, useEffect } from "react";
import { fetchMetadata } from "./fetchMetadata";
import { useTheme } from "../context/ThemeProvider";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LinkPreview = ({ url, right }: { url: any; right: boolean }) => {
  const [metadata, setMetadata] = useState({
    title: "",
    description: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  // @ts-ignore
  const { theme } = useTheme();

  useEffect(() => {
    const getMetadata = async () => {
      setLoading(true);
      const data = await fetchMetadata(url);
      setMetadata(data);

      setLoading(false);
    };

    getMetadata();
  }, [url]);

  // if (loading)
  //   return (
  //     <div className="ml-0 mr-auto line-clamp-1 px-3 text-xs text-[#027EB5]">
  //       {url}
  //     </div>
  //   );

  return (
    <>
      <div className="w-full rounded-[9px]">
        <a
          target="_blank"
          href={url}
          className={`flex flex-col items-center justify-between gap-2 rounded-xl p-1 text-sm ${right ? "bg-[#FFEDAB]" : "bg-otherMessageBg"} ${theme == "dark" ? "text-white" : "text-black"}`}
        >
          {loading ? (
            <div className="flex h-full w-full gap-2">
              <div className="h-full">
                <Skeleton
                  duration={1}
                  baseColor={theme == "dark" ? "#1d1d1d" : "#DFDFDF"}
                  highlightColor={theme == "dark" ? "#252525" : "#fff"}
                  className="h-[4.5rem] min-w-20 object-cover"
                />
              </div>
              <div className="h-full w-full">
                <Skeleton
                  duration={1}
                  baseColor={theme == "dark" ? "#1d1d1d" : "#DFDFDF"}
                  highlightColor={theme == "dark" ? "#252525" : "#fff"}
                  className="h-[4.5rem] object-cover"
                />
              </div>
            </div>
          ) : (
            metadata.title && (
              <div className="flex w-full items-center rounded-xl bg-secondary p-1">
                {metadata.image && (
                  <img
                    className="h-16 w-16 min-w-16 rounded-xl object-cover"
                    src={metadata.image}
                    // src="https://images.unsplash.com/photo-1723103878444-ea3e7597bf73?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt={metadata.title}
                  />
                )}
                <div className="p-3 py-1">
                  {metadata.title && (
                    <h3 className="line-clamp-1 text-sm font-medium">
                      {metadata.title}
                    </h3>
                  )}
                  {metadata.description && (
                    <h3 className="line-clamp-3 text-[10px] font-medium leading-[12px] opacity-50">
                      {metadata.description}
                    </h3>
                  )}
                </div>
              </div>
            )
          )}

          <div className="ml-0 mr-auto line-clamp-1 px-3 text-xs text-[#027EB5]">
            {url}
          </div>
        </a>
      </div>
    </>
  );
};

export default LinkPreview;
