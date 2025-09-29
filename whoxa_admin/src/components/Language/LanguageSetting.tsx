import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useApiPost from '../../hooks/PostData'; // Update the path to where your hook is located
import Swal from 'sweetalert2'; // Import SweetAlert2
import axios from 'axios'; // Ensure axios is imported
import { IoArrowBackCircleOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';

const LanguageSetting = () => {
    const { status_id } = useParams(); // Extract status_id from URL parameters
    const navigate = useNavigate();

    const [keyValuePairs, setKeyValuePairs] = useState([]);
    const [originalKeyValuePairs, setOriginalKeyValuePairs] = useState([]);
    const [changedKeys, setChangedKeys] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [updateFlag, setUpdateFlag] = useState(true);
    const { loading, error, data, postData } = useApiPost();
    const handleNavigate = () => {
        navigate('/admin/System-Setting/LanguageSettings'); // Replace '/desired-route' with your target route
    };
    const translateAll = async () => {
       
        const loader = Swal.fire({
            title: 'Translating...',
            text: 'It will take 5-10 minutes to translate. Please wait while we are translating.',
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const result = await postData('/Translate-all', { status_id });

            if (result.success) {
                console.log('All translations successful');
                loader.close();
                setUpdateFlag(!updateFlag)
                Swal.fire({
                    icon: 'success',
                    title: 'All Translations Successful',
                    text: 'All keywords have been translated successfully.',
                    confirmButtonText: 'OK'
                });
            } else {
                console.error('Translation failed:', result.message);
                loader.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Translation Error',
                    text: result.message || 'Some translations failed.',
                    confirmButtonText: 'OK'
                });
            }
        } catch (err) {
            console.error('Failed to translate all keywords:', err);
            loader.close();
            Swal.fire({
                icon: 'error',
                title: 'Translation Error',
                text: 'An error occurred while translating all keywords.',
                confirmButtonText: 'OK'
            });
        }
    };

    const translateLanguage = async (settingId: string, newValue: string, language: string) => {
        try {
            
            const response = await postData('Translate-Language', {
                setting_id: settingId,
                newValue: newValue,
                language: language,
                status_id: status_id,
            });
            setUpdateFlag(!updateFlag)
            return response.data;
        } catch (error) {
            console.error('Error occurred while translating:', error.response ? error.response.data : error.message);
            throw error;
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await postData('fetch-keywords-with-translation', { page: currentPage, pageSize, status_id: status_id });
                console.log(result);
                
                if (result.success) {
                    setKeyValuePairs(result.results);
                    setOriginalKeyValuePairs(result.results);
                    setTotalItems(result.pagination.totalItems);
                    setChangedKeys(new Set()); // Reset changed keys on fetch
                }
            } catch (err) {
                console.error('Failed to fetch data:', err);
            }
        };

        fetchData();
    }, [currentPage, pageSize, updateFlag]);

    const handleValueChange = (settingId, event) => {
        const newValue = event.target.value;
        const newKeyValuePairs = keyValuePairs.map(pair =>
            pair.setting_id === settingId
                ? { ...pair, Translation: newValue }
                : pair
        );
        setKeyValuePairs(newKeyValuePairs);

        // Update the changed keys
        const updatedChangedKeys = new Set(changedKeys);
        if (newValue !== originalKeyValuePairs.find(pair => pair.setting_id === settingId)?.Translation) {
            updatedChangedKeys.add(settingId);
        } else {
            updatedChangedKeys.delete(settingId);
        }
        setChangedKeys(updatedChangedKeys);
    };

    const handleTranslate = async (settingId) => {
       
        const pairToTranslate = keyValuePairs.find(pair => pair.setting_id === settingId);
        if (!pairToTranslate) return;

        try {
            const result = await translateLanguage(settingId, pairToTranslate.key, 'English'); // Pass key instead of Translation
            if (result.success) {
                console.log('Translation successful');
                // Show SweetAlert on success
                Swal.fire({
                    icon: 'success',
                    title: 'Translated Successfully',
                    text: 'The keyword has been translated successfully.',
                    confirmButtonText: 'OK'
                });
            } else {
                console.error('Failed to translate data:', result.message);
            }
        } catch (err) {
            console.error('Failed to translate data:', err);
        }
    };

    const handleUpdate = async (settingId) => {
      
        const pairToUpdate = keyValuePairs.find(pair => pair.setting_id === settingId);
        if (!pairToUpdate) return;

        const updateData = {
            setting_id: settingId,
            newValue: pairToUpdate.Translation,
            status_id: status_id // Passing language as "English"
        };

        try {
            const result = await postData('Edit-a-Keyword', updateData);
            if (result.success) {
                console.log('Data updated successfully');
                // Show SweetAlert on success
                Swal.fire({
                    icon: 'success',
                    title: 'Updated Successfully',
                    text: 'The keyword has been updated successfully.',
                    confirmButtonText: 'OK'
                });

                // Update original values after successful update
                setOriginalKeyValuePairs(keyValuePairs.map(pair =>
                    pair.setting_id === settingId
                        ? { ...pair, Translation: pairToUpdate.Translation }
                        : pair
                ));
                setChangedKeys(prev => {
                    const updatedChangedKeys = new Set(prev);
                    updatedChangedKeys.delete(settingId);
                    return updatedChangedKeys;
                });
            } else {
                console.error('Failed to update data:', result.message);
            }
        } catch (err) {
            console.error('Failed to update data:', err);
        }
    };

    const totalPages = Math.ceil(totalItems / pageSize);
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
    } else {
        const start = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2));
        const end = Math.min(totalPages - 1, start + maxPagesToShow - 3);

        pageNumbers.push(1);

        if (start > 2) {
            pageNumbers.push('...');
        }

        for (let i = start; i <= end; i++) {
            pageNumbers.push(i);
        }

        if (end < totalPages - 1) {
            pageNumbers.push('...');
        }

        pageNumbers.push(totalPages);
    }

    return (
        <div className="mt-6">
            <div className='flex justify-between'>
                <ul className="flex space-x-2 rtl:space-x-reverse text-sm text-gray-700 mb-5">
                    <li>
                        <Link to="#" className="text-blue-500 hover:underline">
                            System Settings
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
                        <span>Language Setting</span>
                    </li>

                </ul>
                <button
                    onClick={handleNavigate}
                    className='p-2 rounded-full transition-colors duration-200 hover:bg-blue-100'
                >
                    <IoArrowBackCircleOutline className='text-3xl text-blue-500 hover:text-blue-700' />
                </button>
            </div>
            <div className="mt-6 panel overflow-auto">
                <div className="flex justify-between items-center mb-12">
                    <h5 className="font-semibold text-lg dark:text-white-light">Language Setting</h5>
                    <button
                        type="button"
                        onClick={translateAll}
                        className="btn btn-primary"
                    >
                        Translate All
                    </button>

                </div>

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">Error: {error.message}</p>}

                <form className='overflow-auto'>
                    <table className="table-auto w-full">
                        <thead className="text-dark dark:text-white-light">
                            <tr>
                                <th className="text-center !py-4">Setting ID</th>
                                <th className="text-center !py-4">Key</th>
                                <th className="text-center !py-4">Value</th>
                                <th className="text-center !py-4">Auto Translate</th>
                                <th className="text-center !py-4">Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {keyValuePairs.map((pair) => (
                                <tr key={pair.setting_id} className="text-black dark:text-white group">
                                    <td className="p-2 text-center">
                                        {pair.setting_id}
                                    </td>
                                    <td className="p-2 text-center">
                                        <input
                                            type="text"
                                            placeholder="Enter Key"
                                            value={pair.key}
                                            readOnly
                                            className="form-input w-full"
                                        />
                                    </td>
                                    <td className="p-2 text-center">
                                        <input
                                            type="text"
                                            placeholder="Enter Value"
                                            value={pair.Translation}
                                            onChange={(e) => handleValueChange(pair.setting_id, e)}
                                            className="form-input w-full"
                                        />
                                    </td>
                                    <td className="p-2 text-center">
                                        <div className='flex justify-center'>
                                            <button
                                                type="button"
                                                onClick={() => handleTranslate(pair.setting_id)}
                                                className="btn btn-primary"
                                            >
                                                Translate
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-2 text-center">
                                        <div className='flex justify-center'>
                                            <button
                                                type="button"
                                                onClick={() => handleUpdate(pair.setting_id)}
                                                className="btn btn-danger"
                                                disabled={!changedKeys.has(pair.setting_id)}
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                </form>

                {/* Pagination Controls */}
                <div className="flex flex-col mt-4 justify-between items-center sm:flex-row lg:flex-row">

                    {/* Pagination Controls */}
                    <div className="flex items-center text-sm text-dark dark:text-white-light">
                        <span className='font-semibold'>
                            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries
                        </span>
                        <select
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className="appearance-none text-dark border-gray-300 border-[1px] rounded-md dark:bg-[#191e3a] dark:text-white-light ml-2 px-4 py-0.5 focus:outline-none"
                        >
                            {[10, 20, 50, 100].map(option => (
                                <option
                                    className="bg-white dark:bg-[#191e3a] dark:text-white-light text-dark p-2 hover:bg-gray-200 dark:hover:bg-[#30375e] rounded-lg"
                                    key={option}
                                    value={option}
                                >
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Pagination Buttons */}
                    {totalItems > 0 && (
                        <ul className="inline-flex items-center space-x-1 rtl:space-x-reverse">
                            {/* Previous Button */}
                            <li>
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="flex justify-center font-semibold p-2 rounded-full transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                                >
                                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                            </li>

                            {/* Page Numbers */}
                            {(() => {
                                const pages = [];
                                const totalVisiblePages = 5;

                                // Always show the first page
                                pages.push(
                                    <li key={1}>
                                        <button
                                            type="button"
                                            onClick={() => setCurrentPage(1)}
                                            className={`flex justify-center font-semibold px-3.5 py-2 rounded-full transition ${currentPage === 1 ? 'bg-primary text-white' : 'bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary'}`}
                                        >
                                            1
                                        </button>
                                    </li>
                                );

                                let startPage = Math.max(2, currentPage - Math.floor(totalVisiblePages / 2));
                                let endPage = Math.min(totalPages - 1, startPage + totalVisiblePages - 2);

                                if (startPage > 2) {
                                    // Add ellipsis if startPage is not adjacent to the first page
                                    pages.push(
                                        <li key="start-ellipsis">
                                            <span className="px-3 py-2">...</span>
                                        </li>
                                    );
                                }

                                // Add pages between startPage and endPage
                                for (let i = startPage; i <= endPage; i++) {
                                    pages.push(
                                        <li key={i}>
                                            <button
                                                type="button"
                                                onClick={() => setCurrentPage(i)}
                                                className={`flex justify-center font-semibold px-3.5 py-2 rounded-full transition ${currentPage === i ? 'bg-primary text-white' : 'bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary'}`}
                                            >
                                                {i}
                                            </button>
                                        </li>
                                    );
                                }

                                if (endPage < totalPages - 1) {
                                    // Add ellipsis if endPage is not adjacent to the last page
                                    pages.push(
                                        <li key="end-ellipsis">
                                            <span className="px-3 py-2">...</span>
                                        </li>
                                    );
                                }

                                // Always show the last page
                                pages.push(
                                    <li key={totalPages}>
                                        <button
                                            type="button"
                                            onClick={() => setCurrentPage(totalPages)}
                                            className={`flex justify-center font-semibold px-3.5 py-2 rounded-full transition ${currentPage === totalPages ? 'bg-primary text-white' : 'bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary'}`}
                                        >
                                            {totalPages}
                                        </button>
                                    </li>
                                );

                                return pages;
                            })()}

                            {/* Next Button */}
                            <li>
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="flex justify-center font-semibold p-2 rounded-full transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                                >
                                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </li>
                        </ul>
                    )}
                </div>


            </div>
        </div>
    );
};

export default LanguageSetting;
