import React from 'react';
import ReactDOM from 'react-dom';
import { Swiper as ReactSwiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

interface FullScreenImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    images: string[];
    initialSlide: number;
}

const FullScreenImageModal: React.FC<FullScreenImageModalProps> = ({ isOpen, onClose, images, initialSlide }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[50] flex items-center justify-center bg-black bg-opacity-80">
            <div className="relative w-full h-full max-w-screen-lg max-h-screen-lg">
                <button
                    onClick={onClose}
                    className="absolute  top-2 right-2 text-white text-3xl z-50"
                >
                    &times;
                </button>
                <ReactSwiper
                    modules={[Navigation, Pagination]}
                    slidesPerView={1}
                    spaceBetween={30}
                    navigation
                    pagination={{ clickable: true }}
                    initialSlide={initialSlide}
                    className="w-full h-full"
                >
                    {images.map((image, index) => (
                        <SwiperSlide key={index}>
                            <img
                                src={image}
                                alt={`Slide ${index + 1}`}
                                className="object-contain w-full h-full"
                            />
                        </SwiperSlide>
                    ))}
                </ReactSwiper>
            </div>
        </div>,
        document.body
    );
};

export default FullScreenImageModal;
