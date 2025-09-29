import React, { useEffect, useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Slider from "react-slick";
import { useAppSelector } from "../utils/hooks";

function ReactSlickCarousel() {
  const image_list = useAppSelector((state) => state.ViewManager);
  const slider = useRef<Slider | null>(null);

  const settings = {
    dots: false,
    infinite: image_list.image_src!.length >= 2,
    speed: 500,
    slidesToShow: 1,
    autoplay: false,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  function SampleNextArrow(props: any) {
    const { onClick } = props;
    if (image_list.image_src!.length === 1) {
      return null;
    }
    return (
      <div
        className="custom-next-arrow bg-lightTextColor !text-darkTextColor absolute grid h-11 w-11 cursor-pointer place-content-center rounded-full hover:bg-opacity-70"
        onClick={onClick}
      >
        <FiChevronRight className="h-7 w-7" />
      </div>
    );
  }

  function SamplePrevArrow(props: any) {
    const { onClick } = props;
    if (image_list.image_src!.length === 1) {
      return null;
    }
    return (
      <div
        className="custom-prev-arrow bg-lightTextColor !text-darkTextColor grid h-11 w-11 cursor-pointer place-content-center rounded-full hover:bg-opacity-70"
        onClick={onClick}
      >
        <FiChevronLeft className="h-7 w-7" />
      </div>
    );
  }

  const isImage = (url: string) => url.match(/\.(jpeg|jpg|gif|png|webp)$/i);
  const isVideo = (url: string) => url.match(/\.(mp4|webm|ogg)$/i);

  useEffect(() => {
    if (slider.current && typeof image_list.currentIndex === "number") {
      slider.current.slickGoTo(image_list.currentIndex);
    }
  }, [image_list.currentIndex]);

  return (
    <div className="slider-container !overflow-hidden">
      <Slider ref={slider} {...settings}>
        {image_list?.image_src?.map((src, index) => (
          <div className="my-auto" key={index}>
            {isImage(src) ? (
              <img
                className="h-auto w-[90%] rounded-lg object-contain lg:h-[75vh] lg:w-[90%]"
                src={src}
                alt={`Media ${index + 1}`}
              />
            ) : isVideo(src) ? (
              <video
                className="mx-auto h-auto w-fit rounded-lg object-contain lg:h-[75vh] lg:w-[90%]"
                controls
                muted
                playsInline
                preload="metadata"
                autoPlay
              >
                <source src={src} type="video/mp4" />
              </video>
            ) : (
              <img
                className="h-auto w-fit rounded-lg object-contain lg:h-[75vh] lg:w-[90%]"
                src={src}
                alt={`Media ${index + 1}`}
              />
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default ReactSlickCarousel;
