import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useTheme } from "../context/ThemeProvider";

interface LoadingSkeletonImageDynamicProps {
  image_url: string;
  image_height: string;
  image_width: string;
  radius: string;
  className?: string;
  onClickFunc?: () => void;
}

export default function LoadingSkeletonImageDynamic({
  image_url,
  image_height,
  image_width,
  radius,
  className,
  onClickFunc,
}: LoadingSkeletonImageDynamicProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  // @ts-ignore
  const { theme } = useTheme();

  // Use useEffect to listen for changes in image_url
  useEffect(() => {
    // Here you can check if image_url has changed and update the state accordingly
    if (image_url) {
      setImageLoaded(false); // Set the state to false to trigger a reload
    }
  }, [image_url]);

  useEffect(() => {
    const img = new Image();
    img.src = image_url;
    img.onload = () => {
      // setTimeout(() => {
      setImageLoaded(true);
      // }, 1000);
    };
  }, [image_url]);
  return (
    <>
      <div
        onClick={onClickFunc}
        className={`h-fit ${className}`}
        style={{
          lineHeight: 0,
          backgroundImage: !imageLoaded ? "none" : `url(${image_url})`,
          backgroundSize: "cover",
          height: image_height,
          width: image_width,
          backgroundPosition: "center",
          borderRadius: radius,
        }}
      >
        {!imageLoaded && (
          <Skeleton
            baseColor={theme == "dark" ? "#1d1d1d" : "#DFDFDF"}
            highlightColor={theme == "dark" ? "#252525" : "#fff"}
            className={className}
            // style={{
            //   height: image_height,
            //   width: image_width,
            //   borderRadius: radius,
            // }}
          />
        )}
      </div>
    </>
  );
}
