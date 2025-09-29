import React, { useContext } from 'react';
import { UserListSearchTermsContext } from '../../context/UserListSearchTerms';
import { FaSearch } from 'react-icons/fa';

interface UserSearchProps {
    onSearch: (fullName: string) => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ onSearch }) => {
    const { fullName, setFullName } = useContext(UserListSearchTermsContext);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFullName = e.target.value;
        setFullName(newFullName);
        onSearch(newFullName); // Call onSearch immediately on input change
    };

    return (
        <form className="mx-auto w-full sm:w-1/2 mb-5">
            <div className="relative">
                <input
                    type="text"
                    value={fullName}
                    onChange={handleChange}
                    placeholder="Search by Full Name"
                    className="form-input shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] bg-white rounded-full h-11 placeholder:tracking-wider ltr:pr-11 rtl:pl-11 w-full"
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

export default UserSearch;
