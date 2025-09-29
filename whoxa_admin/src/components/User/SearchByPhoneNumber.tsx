import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchByPhoneNumberProps {
    onSearch: (phoneNumber: string) => void;
}

const SearchByPhoneNumber: React.FC<SearchByPhoneNumberProps> = ({ onSearch }) => {
    const [phoneNumber, setPhoneNumber] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPhoneNumber = e.target.value;
        setPhoneNumber(newPhoneNumber);
        onSearch(newPhoneNumber);
    };

    return (
        <form className="mx-auto w-full sm:w-1/2 mb-5">
            <div className="relative">
                <input
                    type="text"
                    value={phoneNumber}
                    placeholder="Search by phone number"
                    className="form-input shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] bg-white rounded-full h-11 placeholder:tracking-wider ltr:pr-11 rtl:pl-11 w-full"
                    onChange={handleChange}
                />
                <button
                    type="button"
                    className="btn btn-primary absolute ltr:right-1 rtl:left-1 inset-y-0 m-auto rounded-full w-9 h-9 p-0 flex items-center justify-center"
                >
                    <FaSearch />
                </button>
            </div>
        </form>
    );
};

export default SearchByPhoneNumber;
