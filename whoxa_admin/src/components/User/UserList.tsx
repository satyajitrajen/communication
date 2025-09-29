import React, { useContext } from 'react';
import Header from './ListHeader';
import UserDetails from './UserDetails';
import { Link } from 'react-router-dom';
import { UserListSearchTermsContext } from '../../context/UserListSearchTerms';

const UserList: React.FC = () => {
    const { searchBy, setSearchBy, fullName, setFullName, phoneNumber, setPhoneNumber } = useContext(UserListSearchTermsContext);

    const handleSearch = (searchTerm: string, searchBy: 'fullName' | 'phoneNumber') => {
        if (searchBy === 'fullName') {
            setFullName(searchTerm);
        } else {
            setPhoneNumber(searchTerm);
        }
        setSearchBy(searchBy);
    };

    return (
      <div className="mt-6">
        <div className="flex justify-between items-center mb-5">
          <ul className="flex space-x-2 rtl:space-x-reverse text-sm text-gray-700">
            <li>
              <Link to="#" className="text-blue-500 hover:underline">
                Users
              </Link>
            </li>
            <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
              <span>User Details</span>
            </li>
          </ul>
        </div>
        <div className="text-2xl text-dark mb-3 mt-3">User Details</div>

        <div className="panel">
          <div className="flex justify-between items-center mb-5">
            <h5 className="font-semibold text-md sm:text-lg  dark:text-white-light">User List</h5>
            <Header onSearch={handleSearch} />
          </div>
          <UserDetails searchTerm={searchBy === 'fullName' ? fullName : phoneNumber} searchBy={searchBy} />
        </div>
      </div>
    );
};

export default UserList;
