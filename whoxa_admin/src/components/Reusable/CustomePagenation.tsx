import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const CustomPagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <ul className="inline-flex items-center space-x-1 rtl:space-x-reverse m-auto mb-4">
            <li>
                <button
                    type="button"
                    className="flex justify-center font-semibold p-2 rounded-full transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <svg> {/* Left Arrow Icon */} </svg>
                </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
                <li key={index}>
                    <button
                        type="button"
                        className={`flex justify-center font-semibold px-3.5 py-2 rounded-full transition ${
                            currentPage === index + 1
                                ? 'bg-primary text-white dark:bg-primary'
                                : 'bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary'
                        }`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                </li>
            ))}
            <li>
                <button
                    type="button"
                    className="flex justify-center font-semibold p-2 rounded-full transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <svg> {/* Right Arrow Icon */} </svg>
                </button>
            </li>
        </ul>
    );
};

export default CustomPagination;
