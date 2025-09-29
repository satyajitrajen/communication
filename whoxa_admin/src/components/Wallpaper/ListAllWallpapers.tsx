import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { FaTrashAlt } from 'react-icons/fa';
import useApiPost from "../../hooks/PostData";
import { Link } from 'react-router-dom';
import { DataTable } from 'mantine-datatable';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import FullScreenImageModal from '../Reusable/FullScreenImageModal';
import Modal from '../Reusable/Model';
import EditWallpaper from './EditWallpaper';
import toast from 'react-hot-toast';

export interface Welcome {
    success: boolean;
    message: string;
    wallpapers: Wallpaper[];
    pagenation: Pagenation;
}

export interface Pagenation {
    count: number;
    currentPage: number;
    totalPages: number;
}

export interface Wallpaper {
    wallpaper_image: string;
    wallpaper_id: number;
    wallpaper_title: string;
    wallpaper_status: boolean;
    createdAt: Date;
    updatedAt: Date;
}
const ListAllWallpapers: React.FC = () => {
    const [wallpaperRes, setWallpaperRes] = useState<Welcome>()
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { postData, } = useApiPost();
    const [updateFlag, setUpdateFlag] = useState<boolean>(false);
    const [limit, setLimit] = useState<number>(10);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [selectedWallpaperId, setSelectedWallpaperId] = useState<number | null>(null);

    const openModal = (index: number) => {
        setCurrentImageIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };


    const handleToggle = async (wall: Wallpaper) => {
     
        const result = await Swal.fire({
            icon: 'question',
            title: 'Are you sure?',
            text: `Do you really want to update the status of Wallpaper ${wall.wallpaper_title}?`,
            showCancelButton: true,
            confirmButtonText: 'Yes, update it!',
            cancelButtonText: 'No, keep it',
            customClass: {
                confirmButton: 'bg-red-500 text-white',
                cancelButton: 'bg-gray-300 text-black'
            },
            padding: '2em',
        });

        if (result.isConfirmed) {
            try {
                const response = await postData('update-wallpaper-status', { wallpaper_id: wall.wallpaper_id });
                if (response.success) {
                    Swal.fire('Updated!', 'Wallpaper status has been updated successfully.', 'success');
                    setUpdateFlag(prev => !prev); // Trigger re-render
                } else {
                    Swal.fire('Error!', response.message, 'error');
                }
            } catch (error) {
                console.error('Error updating wallpaper status:', error);
                Swal.fire('Error!', 'There was a problem updating the wallpaper status.', 'error');
            }
        }
    };

    const fetchWallpapers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await postData('list-all-wallapapers', { page: currentPage, pageSize: limit });

            console.log(response);

            if (response && response.success === true) {

                setWallpaperRes(response)

                // setReportedUsers(response.isReportedUsers);
                // setTotalPages(response.pagination.pages);
            } else if (response.message === 'No wallpapers found') {
                console.log("aa");

                setError('No Reported Users')
                const result = await Swal.fire({
                    icon: 'error',
                    title: 'No Reported Users',
                    text: 'Do you want to go on Home Page',
                    // showCancelButton: true,
                    confirmButtonText: 'Okay',
                    customClass: {
                        confirmButton: 'bg-yellow-500 text-white',
                    },
                    padding: '2em',
                })

            }
            else {
                setError('Error fetching Wallpapers');
            }
        } catch (err: any) {
            setError('Error fetching Wallpapers');
        } finally {
            setLoading(false);
        }
    }, [currentPage, limit, postData]);
    useEffect(() => {
        fetchWallpapers();
    }, [currentPage, updateFlag, limit]);




    const onEdit = (id: number) => {
      
        setSelectedWallpaperId(id);
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedWallpaperId(null); // Reset the selected ID
    };


    const handleDelete = async (wall: Wallpaper) => {

     
        const result = await Swal.fire({
            icon: 'question',
            title: 'Are you sure?',
            text: `Do you really want to delete Wallpaper ${wall.wallpaper_title}?`,
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
            customClass: {
                confirmButton: 'bg-red-500 text-white',
                cancelButton: 'bg-gray-300 text-black'
            },
            padding: '2em',
        });

        if (result.isConfirmed) {
            try {
                const response = await postData('delete-wallpaper', { wallpaper_id: wall.wallpaper_id });
                if (response.success === true) {
                    Swal.fire('Deleted!', 'Wallpaper has been deleted successfully.', 'success');
                    setUpdateFlag(prev => !prev);
                    // setReportedUsers(reportedUsers.filter(u => u.user_id !== user.user_id));
                } else {
                    Swal.fire('Error!', response.message, 'error');
                    setUpdateFlag(prev => !prev);
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                Swal.fire('Error!', 'There was a problem deleting the Wallpaper.', 'error');
            }

        }
    };


    if (loading) return <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
        <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
    </div>;
    if (error) return <p>{error}</p>;
    return (
      <div className="mt-6">
        <ul className="flex space-x-2 rtl:space-x-reverse text-sm text-gray-700">
          <li>
            <Link to="#" className="text-blue-500 hover:underline">
              Wallpaper Settings
            </Link>
          </li>
          <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
            <span>Wallpaper List</span>
          </li>
        </ul>
        <div className="text-2xl text-dark mb-3 mt-3">Wallpaper list</div>

        <div className="mt-6 panel overflow-auto">
          <div className="flex justify-between items-center mb-5">
            <h5 className="font-semibold text-lg dark:text-white-light">Walllpaper List</h5>
          </div>
          <div className="my-9 mx- datatables">
            <table className="mt-4 rounded-md bg-white dark:bg-gray-900 dark:text-gray-200">
              <thead className="bg-gray-800 " style={{ fontWeight: 700 }}>
                <tr>
                  <th className="text-left !py-5 !px-7  font-bold ">ID</th>
                  <th className="text-left py-4 font-bold">Wallpaper Image</th>
                  <th className="text-left py-4 font-bold">Wallpaper Name</th>
                  <th className="text-left py-4 font-bold">Status</th>
                  <th className="text-center py-4 font-bold">Actions</th>
                </tr>
              </thead>
              {wallpaperRes?.wallpapers.length > 0 ? (
                <tbody>
                  {wallpaperRes?.wallpapers.map((wallpaper: any, index) => (
                    <tr key={wallpaper.wallpaper_id} className="border-b border-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="p-4 ">
                        <strong className="text-info">#{wallpaper.wallpaper_id}</strong>
                      </td>
                      <td className="p-4 flex items-center">
                        <div className="overflow-hidden cursor-pointer" onClick={() => openModal(index)}>
                          <img src={wallpaper.wallpaper_image} alt="Wallpaper Image" className="w-9 h-9 rounded-full max-w-none" />
                        </div>
                      </td>
                      <td className="p-4 ">{wallpaper.wallpaper_title}</td>
                      <td className="p-4">
                        <div
                          onClick={() => handleToggle(wallpaper)}
                          className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${wallpaper.wallpaper_status ? 'bg-blue-500' : 'bg-gray-300'}`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${wallpaper.wallpaper_status ? 'translate-x-4' : 'translate-x-0'}`}
                          ></div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center">
                          <Tippy
                            content="Delete"
                            placement="top"
                            offset={[0, 0]} // [horizontal offset, vertical offset]
                          >
                            <button onClick={() => handleDelete(wallpaper)} className="flex items-center  py-2 text-white  rounded-md transition-colors duration-300">
                              <div className="grid place-content-center w-8 h-8 text-black dark:text-white rounded-md">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                                  <path d="M20.5001 6H3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                                  <path
                                    d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5"
                                    stroke="currentColor"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                  ></path>
                                  <path opacity="0.5" d="M9.5 11L10 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                                  <path opacity="0.5" d="M14.5 11L14 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                                  <path
                                    opacity="0.5"
                                    d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6"
                                    stroke="currentColor"
                                    stroke-width="1.5"
                                  ></path>
                                </svg>
                              </div>
                            </button>
                          </Tippy>
                          <Tippy content="Edit" placement="top" offset={[0, 0]}>
                            <button onClick={() => onEdit(wallpaper.wallpaper_id)} className="flex items-center px- py-2 text-black dark:text-white  rounded-md transition-colors duration-300">
                              <div className="grid place-content-center w-8 h-8  rounded-md">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                                  <path opacity="0.5" d="M4 22H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                                  <path
                                    d="M14.6296 2.92142L13.8881 3.66293L7.07106 10.4799C6.60933 10.9416 6.37846 11.1725 6.17992 11.4271C5.94571 11.7273 5.74491 12.0522 5.58107 12.396C5.44219 12.6874 5.33894 12.9972 5.13245 13.6167L4.25745 16.2417L4.04356 16.8833C3.94194 17.1882 4.02128 17.5243 4.2485 17.7515C4.47573 17.9787 4.81182 18.0581 5.11667 17.9564L5.75834 17.7426L8.38334 16.8675L8.3834 16.8675C9.00284 16.6611 9.31256 16.5578 9.60398 16.4189C9.94775 16.2551 10.2727 16.0543 10.5729 15.8201C10.8275 15.6215 11.0583 15.3907 11.5201 14.929L11.5201 14.9289L18.3371 8.11195L19.0786 7.37044C20.3071 6.14188 20.3071 4.14999 19.0786 2.92142C17.85 1.69286 15.8581 1.69286 14.6296 2.92142Z"
                                    stroke="currentColor"
                                    stroke-width="1.5"
                                  ></path>
                                  <path
                                    opacity="0.5"
                                    d="M13.8879 3.66406C13.8879 3.66406 13.9806 5.23976 15.3709 6.63008C16.7613 8.0204 18.337 8.11308 18.337 8.11308M5.75821 17.7437L4.25732 16.2428"
                                    stroke="currentColor"
                                    stroke-width="1.5"
                                  ></path>
                                </svg>
                              </div>
                            </button>
                          </Tippy>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  <tr className="">
                    <td colSpan={5} className="my-4 text-center py-4 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800 dark:text-gray-400">
                      No data available in table
                    </td>
                  </tr>
                </tbody>
              )}
            </table>

            <div className="flex flex-col mt-4 justify-between items-center sm:flex-row lg:flex-row">
              {/* Pagination Controls */}
              <div className="flex items-center text-sm text-dark dark:text-white-light">
                <span className="font-semibold">
                  Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, wallpaperRes?.pagination.count)} of {wallpaperRes?.pagination?.count} entries
                </span>
                <select
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="appearance-none text-dark border-gray-300 border-[1px] rounded-md dark:bg-[#191e3a] dark:text-white-light ml-2 px-4 py-0.5 focus:outline-none  "
                >
                  {[10, 20, 50].map((option) => (
                    <option
                      className="bg-white dark:bg-[#191e3a] dark:text-white-light text-dark p-2 hover:bg-gray-200 dark:hover:bg-[#30375e]  dark:focus:bg-[#30375e] rounded-lg"
                      key={option}
                      value={option}
                    >
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pagination Buttons */}
              {wallpaperRes?.wallpapers.length > 0 ? (
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
                  {/* Page Number Buttons */}
                  {[...Array(wallpaperRes?.pagination.pages)].map((_, i) => (
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
                      onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
                      disabled={currentPage === wallpaperRes?.pagination.pages}
                      className="flex justify-center font-semibold p-2 rounded-full transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                    >
                      <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </li>
                </ul>
              ) : (
                <div> </div>
              )}
            </div>
          </div>
        </div>
        <FullScreenImageModal isOpen={isModalOpen} onClose={closeModal} images={wallpaperRes?.wallpapers.map((wall) => wall.wallpaper_image) || []} initialSlide={currentImageIndex} />
      </div>
    );
};

export default ListAllWallpapers;
