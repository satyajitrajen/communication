import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <form className="mx-auto w-1/2 sm:w-full">
            <div className="relative w-full">
                <input
                    type="text"
                    value={value}
                    onChange={handleChange}
                    placeholder="Search by name or number"
                    className="hidden md:block md:w-96 px-4 py-2 shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] bg-white rounded-full h-11 placeholder:tracking-wide placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-primary dark:bg-dark-dark-light"
                />
                <button
                    type="button"
                    className="absolute inset-y-0 right-1 m-auto rounded-full w-9 h-9 p-0 flex items-center justify-center bg-primary text-white"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                        <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5" opacity="0.5"></circle>
                        <path d="M18.5 18.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                    </svg>
                </button>
            </div>
        </form>
    );
};

export default SearchBar;
