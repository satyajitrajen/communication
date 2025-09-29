import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CountryWiseUserData from '../components/Dashboard/CountryWiseUserData'; // Import your country-wise data component
import useApiPost from '../hooks/PostData'; // For the API call

function CountryWiseAnlysisPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10); // Number of entries per page
    const [pagination, setPagination] = useState({ page: 1, pageSize: 10, totalPages: 1, totalEntries: 0 }); // For pagination info
    const { loading, postData } = useApiPost();

    // Fetch country-wise data with pagination
    useEffect(() => {
        const fetchCountryData = async () => {
            const response = await postData('Get-Countrywise-trafic', { page: currentPage, pageSize: limit });
            if (response && response.success) {
                // Set pagination details based on the response
                setPagination({
                    page: response.pagination.page,
                    pageSize: response.pagination.pageSize,
                    totalPages: response.pagination.totalPages,
                    totalEntries: response.pagination.totalCountries // Use `totalCountries` here
                });
            }
        };
        fetchCountryData();
    }, [currentPage, limit]);

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
              <span>Countrywise Users</span>
            </li>
          </ul>
        </div>
        <div className="text-2xl text-dark mb-3 mt-3">Countrywise Users</div>

        {/* Country-wise User Data Display */}
        <CountryWiseUserData currentPage={currentPage} limit={limit} />

        {/* Pagination Controls */}
        {pagination.totalPages >= 1 && (
          <div className="flex flex-col mt-4 justify-between items-center sm:flex-row lg:flex-row">
            {/* Showing Entries */}
            <div className="flex items-center text-sm text-dark dark:text-white-light">
              <span className="font-semibold">
                Showing {(currentPage - 1) * pagination.pageSize + 1} to {Math.min(currentPage * pagination.pageSize, pagination.totalEntries)} of {pagination.totalEntries} entries
              </span>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="appearance-none text-dark border-gray-300 border-[1px] rounded-md dark:bg-[#191e3a] dark:text-white-light ml-2 px-4 py-0.5 focus:outline-none"
              >
                {[10, 20, 50].map((option) => (
                  <option
                    className="bg-white dark:bg-[#191e3a] dark:text-white-light text-dark p-2 hover:bg-gray-200 dark:hover:bg-[#30375e] dark:focus:bg-[#30375e] rounded-lg"
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Pagination Buttons */}
            <ul className="inline-flex items-center space-x-1 rtl:space-x-reverse">
              {/* Previous Button */}
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex justify-center font-semibold p-2 rounded-full transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                >
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </li>

              {/* Page Numbers */}
              {[...Array(pagination.totalPages)].map((_, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(i + 1)}
                    className={`flex justify-center font-semibold px-3.5 py-2 rounded-full transition ${
                      currentPage === i + 1 ? 'bg-primary text-white' : 'bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary'
                    }`}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}

              {/* Next Button */}
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, pagination.totalPages))}
                  disabled={currentPage === pagination.totalPages}
                  className="flex justify-center font-semibold p-2 rounded-full transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                >
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    );
}

export default CountryWiseAnlysisPage;
