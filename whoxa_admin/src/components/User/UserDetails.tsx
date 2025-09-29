// UserDetails.tsx
import React, { useState, useEffect, useCallback } from 'react';
import useApiPost from "../../hooks/PostData";
import { DataTable } from 'mantine-datatable';
import { Pagination } from '@mantine/core';
import Dropdown from '../../components/Dropdown';
import Swal from 'sweetalert2';
import useAPI from '../../hooks/PostData';
import FullScreenImageModal from '../Reusable/FullScreenImageModal';
import toast from 'react-hot-toast';
import { format } from 'date-fns';


interface User {
    user_id: number;
    user_name: string;
    profile_image: string;
    first_name: string;
    last_name: string;
    dob: string;
    country: string;
    combined_num: string;
    country_code: string;
    phone_number: number;
    email_id: string;
    password: string;
    login_type: string;
    verified: boolean;
    status: boolean;
    otp: number;
    otp_verification: boolean;
    Blocked_by_admin: boolean;
    createdAt: string;
    updatedAt: string;
}

interface UserDetailsProps {
    searchTerm: string;
    searchBy: 'fullName' | 'phoneNumber';
}

const UserDetails: React.FC<UserDetailsProps> = ({ searchTerm, searchBy }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ total: 0, pages: 1 });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [updateFlag, setUpdateFlag] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [initialSlide, setInitialSlide] = useState<number>(0);

    const { postData } = useAPI();

    const handleImageClick = (images: string[], index: number) => {
        setSelectedImages(images);
        setInitialSlide(index);
        setIsModalOpen(true);
    };
    // Helper function to get visible page numbers
    const getVisiblePages = (totalPages: number, currentPage: number, maxVisible = 5) => {
        const pages = [];

        const half = Math.floor(maxVisible / 2);
        let start = Math.max(currentPage - half, 1);
        let end = Math.min(start + maxVisible - 1, totalPages);

        if (end - start < maxVisible - 1) {
            start = Math.max(end - maxVisible + 1, 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    // const fetchUsers = useCallback(async () => {
    async function fetchUsers() {
        setLoading(true);
        try {
            const payload: any = { page: currentPage, limit };
            if (searchBy === 'fullName') {
                payload.fullName = searchTerm;
            } else if (searchBy === 'phoneNumber') {
                payload.phoneNumber = searchTerm;
            }

            const response = await postData('list-all-User', payload);
            console.log(response);

            if (response && response.allUsers) {
                setUsers(response.allUsers);
                setPagination(response.pagination);
            }
        } catch (err: any) {
            setError('Error fetching users');
        } finally {
            setLoading(false);
        }
    }

    const createTitle = (title: string) => (
        <div className="font-bold p-2 ">{title}</div> // Tailwind CSS classes applied
    );
    const createTitleCenter = (title: string) => (
        <div className="font-bold p-2 text-center">{title}</div> // Tailwind CSS classes applied
    );
    const handleBlock = async (user_id: number, Blocked_by_admin: boolean | undefined, profile_image: string | undefined, first_name: string | undefined) => {
        console.log(profile_image);
        
        if (Blocked_by_admin) {
            const result = await Swal.fire({
                html: `
                    <div class="flex flex-col items-center justify-center text-center">
                        <img src="${profile_image}" alt="User Profile Image" class="
                            rounded-full 
                            w-24 
                            h-24 
                            object-cover 
                            mb-4
                        ">
                        <h2 class="text-lg font-semibold mb-2">Unblock User?</h2>
                        <p class="text-base">Do you really want to Unblock user ${first_name}?</p>
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: 'Yes, Block!',
                cancelButtonText: 'No, keep it',
                customClass: {
                    confirmButton: 'bg-yellow-500 text-white',
                    cancelButton: 'bg-gray-300 text-black'
                },
                padding: '2em',
            });


            if (result.isConfirmed) {
                try {
                    const response = await postData('unblock-a-user', { user_id: user_id });
                    if (response.success === 'true') {
                        Swal.fire('Unblocked!', 'User has been unblocked successfully.', 'success');
                    } else {
                        Swal.fire('Error!', response.message, 'error');
                    }
                    setUpdateFlag(!updateFlag)

                } catch (error) {
                    console.error('Error unblocking user:', error);
                    Swal.fire('Error!', 'There was a problem unblock the user.', 'error');
                }

            }
        }
        else {
            const result = await Swal.fire({
                html: `
                    <div class="flex flex-col items-center justify-center text-center">
                        <img src="${profile_image}" alt="User Profile Image" class="
                            rounded-full 
                            w-24 
                            h-24 
                            object-cover 
                            mb-4
                        ">
                        <h2 class="text-lg font-semibold mb-2">Block User?</h2>
                        <p class="text-base">Do you really want to block user ${first_name}?</p>
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: 'Yes, Block!',
                cancelButtonText: 'No, keep it',
                customClass: {
                    confirmButton: 'bg-yellow-500 text-white',
                    cancelButton: 'bg-gray-300 text-black'
                },
                padding: '2em',
            });
            if (result.isConfirmed) {
                try {
                    const response = await postData('block-a-user', { user_id: user_id });
                    if (response.success === 'true') {
                        Swal.fire('Blocked!', 'User has been blocked successfully.', 'success');
                    } else {
                        Swal.fire('Error!', response.message, 'error');
                    }
                    setUpdateFlag(!updateFlag)

                } catch (error) {
                    console.error('Error blocking user:', error);
                    Swal.fire('Error!', 'There was a problem blockning the user.', 'error');
                }

            }
        }

    };

    // }, [searchTerm, searchBy, currentPage, limit]);


    useEffect(() => {
        console.log(searchTerm, searchBy, currentPage, limit, "searchTerm, searchBy, currentPage, limit");
        fetchUsers();
    }, [searchTerm, searchBy, currentPage, limit, updateFlag]);

    if (loading) return <span className="animate-spin border-[3px] border-transparent border-l-primary rounded-full w-6 h-6 inline-block align-middle m-auto mb-10"></span>;
    if (error) return <div>Error occurred!</div>;

    return (
        <div>

            {users.length === 0 ? (
                <div className="my-9 mx- datatables">
                    <table className="mt-4 rounded-md bg-white dark:bg-gray-900 dark:text-gray-200">
                        <thead className="bg-gray-800 border-b 0" style={{ fontWeight: 700 }}>
                            <tr>
                                <th className="text-left !py- font-bold ">ID</th>
                                <th className="text-left py-4 font-bold">Full Name</th>
                                <th className="text-left py-4 font-bold">User Name</th>
                                <th className="text-left py-4 font-bold">Country</th>
                                <th className="text-left py-4 font-bold">Country Code</th>
                                <th className="text-center py-4 font-bold">Platform</th>
                                <th className="text-center py-4 font-bold">Report Counts</th>
                                <th className="text-center py-4 font-bold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan={5} className="my-4 text-center py-4 text-gray-500 hover:bg-gray-50 dark:text-gray-400">
                                    No data available in table
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <DataTable
                    highlightOnHover
                    className="whitespace-nowrap table-hover !overflow-auto slick-thumb"
                    records={users}
                    columns={[
                        {
                            accessor: 'user_id',
                            title: createTitle('ID'),
                            render: ({ user_id }) => (
                                <strong className="text-info">#{user_id}</strong>
                            ),
                        },
                        {
                            accessor: 'firstName',
                            title: createTitle('Full Name'),
                            render: ({ first_name, last_name, profile_image, sub_data }) => (
                                <div className="flex items-center gap-2">
                                    <div onClick={() => handleImageClick([profile_image], 0)} className="cursor-pointer">
                                        <img src={profile_image} className="w-9 h-9 rounded-full max-w-none" alt="user-profile" />
                                    </div>
                                    <div className=" flex flex-col ">
                                        <span className='font-bold'>
                                            {first_name + ' ' + last_name}
                                        </span>
                                        <span className='text-gray-400 dark:text-gray-700 font-extralight'>
                                            {sub_data}
                                        </span>
                                    </div>
                                </div>
                            ),
                        },

                        {
                            accessor: 'user_name',
                            title: createTitle('User Name'),
                            render: ({ user_name }) => (
                                <div className='flex gap-2'>
                                    <div>{user_name}</div>
                                </div>
                            ),
                        },
                        {
                            accessor: 'country',
                            title: createTitle('Country'),
                            render: ({ country }) => (
                                <div className="flex items-center gap-2">
                                    <img width="24" src={`/assets/images/flags/${country.substring(0, 2).toUpperCase()}.svg`} className="max-w-none" alt="flag" />
                                    <div>{country.substring(0, 2).toUpperCase()}</div>
                                </div>
                            ),
                        },
                        {
                            accessor: 'joining_date',
                            title: createTitleCenter('Joining date'),
                            render: ({ createdAt }) => (

                                <div className='text-center'>{format(new Date(createdAt), 'MMMM dd, yyyy')}</div>
                            ),
                        },

                        {
                            accessor: 'platform',
                            title: createTitleCenter('Platform'),
                            render: ({ is_web, is_mobile }) => (
                                <div className='flex justify-center  '>
                                    {is_web ? <div className="flex items-center justify-center w-1/2 " >
                                        <span className="badge badge-outline-success rounded-full">Web</span>
                                    </div> : null}
                                    {is_mobile ? <div className="flex items-center justify-center w-1/2">
                                        <span className="badge badge-outline-warning rounded-full">
                                            App
                                        </span>
                                    </div> : null}

                                </div>
                            ),
                        },
                        {
                            accessor: 'Reported_User',
                            title: createTitleCenter('Report Counts'),
                            render: ({ Reported_User }) => (
                                <div className='w-full flex justify-center'>
                                    <div className='m-auto'>
                                        {
                                            Reported_User?.length
                                        }
                                    </div>

                                </div>
                            ),
                        },
                        {
                            accessor: 'status',
                            title: createTitle('Status'),
                            render: ({ status }) => (
                                <div>{status ? <div className='text-success'>Online</div> : <div className='text-danger'>Offline</div>}</div>
                            ),
                        },
                        {
                            accessor: 'action',
                            title: createTitle('Actions'),
                            render: ({ Blocked_by_admin, user_id, profile_image, first_name }) => (
                                <div className='flex justify-left items-center'>
                                    <div>{Blocked_by_admin ? <div className='text-danger'>Blocked</div> : <div className='text-success'>Active</div>}</div>
                                    <div className="relative dropdown">
                                        <Dropdown
                                            btnClassName=" btn p-0 rounded-none border-0 shadow-none dropdown-toggle text-black dark:text-white-dark hover:text-primary"
                                            button={
                                                <svg
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-6 h-6 rotate-90 opacity-70"
                                                >
                                                    <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5"></circle>
                                                    <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5"></circle>
                                                    <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5"></circle>
                                                </svg>
                                            }
                                        >
                                            <ul className="absolute -bottom-2  right-5 mt-2 z-[10000] min-w-[170px] bg-white shadow-lg  dark:bg-dark-dark-light  rounded-md">

                                                <li>
                                                    <button type="button" className="block w-full px-4 py-2 text-left" onClick={() => handleBlock(user_id, Blocked_by_admin, profile_image, first_name)}>{Blocked_by_admin ? 'Unblock' : 'Block'}</button>
                                                </li>
                                            </ul>
                                        </Dropdown>
                                    </div>


                                </div>
                            ),
                        }


                    ]}
                    minHeight={200}
                />
            )}
            {/* Pagination and other controls */}
            <div className="flex flex-col mt-4 justify-between items-center sm:flex-row lg:flex-row">


                {/* Pagination Controls */}
                <div className="flex items-center text-sm text-dark dark:text-white-light">
                    <span className='font-semibold' >
                        Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, pagination.total)} of {pagination?.total} entries
                    </span>
                    <select
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                        className="appearance-none text-dark border-gray-300 border-[1px] rounded-md dark:bg-[#191e3a] dark:text-white-light ml-2 px-4 py-0.5 focus:outline-none  "
                    >
                        {[10, 20, 50].map(option => (
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
                {pagination?.total > 10 ? (
                    <ul className="inline-flex items-center space-x-1 rtl:space-x-reverse">
                        {/* Previous */}
                        <li>
                            <button
                                type="button"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="flex justify-center font-semibold p-2 rounded-full transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        </li>

                        {/* First page and ellipsis */}
                        {currentPage > 3 && (
                            <>
                                <li>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentPage(1)}
                                        className="px-3.5 py-2 rounded-full font-semibold bg-white-light text-dark hover:text-white hover:bg-primary"
                                    >
                                        1
                                    </button>
                                </li>
                                {currentPage > 4 && <li className="px-2">...</li>}
                            </>
                        )}

                        {/* Dynamic visible pages */}
                        {getVisiblePages(pagination.pages, currentPage).map((page) => (
                            <li key={page}>
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3.5 py-2 rounded-full font-semibold transition ${currentPage === page
                                        ? 'bg-primary text-white'
                                        : 'bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary'
                                        }`}
                                >
                                    {page}
                                </button>
                            </li>
                        ))}

                        {/* Last page and ellipsis */}
                        {currentPage < pagination.pages - 2 && (
                            <>
                                {currentPage < pagination.pages - 3 && <li className="px-2">...</li>}
                                <li>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentPage(pagination.pages)}
                                        className="px-3.5 py-2 rounded-full font-semibold bg-white-light text-dark hover:text-white hover:bg-primary"
                                    >
                                        {pagination.pages}
                                    </button>
                                </li>
                            </>
                        )}

                        {/* Next */}
                        <li>
                            <button
                                type="button"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.pages))}
                                disabled={currentPage === pagination.pages}
                                className="flex justify-center font-semibold p-2 rounded-full transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </li>
                    </ul>


                ) :
                    (<div> </div>)}
            </div>
            <FullScreenImageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                images={selectedImages}
                initialSlide={initialSlide}
            />

        </div>
    );
};

export default UserDetails;
