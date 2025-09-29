import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination_comp: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const maxPagesToShow = 5; // Maximum number of page buttons to show

    // Calculate page range
    let startPage = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 1);
    let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(endPage - maxPagesToShow + 1, 1);
    }

    const pages = [];
    if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('...');
        pages.push(totalPages);
    }

    return (
        <div className="flex m-auto mt-5">
            <ul className="inline-flex items-center space-x-1 rtl:space-x-reverse m-auto">
                <li>
                    <button
                        type="button"
                        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                        className="flex justify-center font-semibold px-3.5 py-2 rounded transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                        disabled={currentPage === 1}
                    >
                        <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16" className="bi bi-chevron-left" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.293 9.293a1 1 0 0 0 0-1.414L8.707 5.707a1 1 0 0 0-1.414 1.414L9.586 9l-2.293 2.293a1 1 0 0 0 1.414 1.414l2.293-2.293z" />
                        </svg>
                    </button>
                </li>
                {pages.map((page, index) => (
                    <li key={index}>
                        {page === '...' ? (
                            <span className="flex justify-center font-semibold px-3.5 py-2 rounded transition bg-white-light text-dark dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary">...</span>
                        ) : (
                            <button
                                type="button"
                                onClick={() => onPageChange(page)}
                                className={`flex justify-center font-semibold px-3.5 py-2 rounded transition ${currentPage === page ? 'bg-primary text-white dark:text-white-light dark:bg-primary' : 'bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary'}`}
                            >
                                {page}
                            </button>
                        )}
                    </li>
                ))}
                <li>
                    <button
                        type="button"
                        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                        className="flex justify-center font-semibold px-3.5 py-2 rounded transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                        disabled={currentPage === totalPages}
                    >
                        <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16" className="bi bi-chevron-right" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.707 9.293a1 1 0 0 1 0-1.414L7.293 5.707a1 1 0 1 1 1.414 1.414L6.414 9l2.293 2.293a1 1 0 0 1-1.414 1.414l-2.293-2.293z" />
                        </svg>
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Pagination_comp;
