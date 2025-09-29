import React, { useState, useEffect } from "react";
import { fetchMetadata } from "./fetchMetadata";
import { useTheme } from "../context/ThemeProvider";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { IoMdLink } from "react-icons/io";

const LinkPreviewForSidebar = ({
  url,
  right,
}: {
  url: any;
  right: boolean;
}) => {
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
      console.log(data, "datasss");

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
      {loading ? (
        <div className="flex h-24 w-full gap-2">
          <div className="h-full">
            <Skeleton
              duration={1}
              baseColor={theme == "dark" ? "#1d1d1d" : "#DFDFDF"}
              highlightColor={theme == "dark" ? "#252525" : "#fff"}
              className="h-24 w-full object-cover"
            />
          </div>
        </div>
      ) : (
        <a
          href={url}
          target="_blank"
          className="relative flex w-full items-center rounded-lg bg-secondary p-1"
        >
          {metadata.image && (
            <img
              className="h-24 w-full rounded-lg object-cover opacity-70"
              src={metadata.image}
              // src="https://images.unsplash.com/photo-1723103878444-ea3e7597bf73?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt={metadata.title}
            />
          )}
          <div className="absolute left-0 grid w-full place-content-center">
            <IoMdLink className="h-6 w-6" />
          </div>
        </a>
      )}
    </>
  );
};

export default LinkPreviewForSidebar;
