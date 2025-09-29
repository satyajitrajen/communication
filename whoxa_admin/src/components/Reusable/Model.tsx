import React from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-[50]
        "> {/* Set a z-index for the modal */}
            <div className="bg-white  dark:bg-[#191e3a]  dark:text-white rounded-lg shadow-lg max-h-[95vh] overflow-hidden w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl p-4 relative z-30"> {/* Ensure the modal content has lower z-index */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 z-50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {children}
            </div>
        </div>,
        document.body
    );
};

export default Modal;
