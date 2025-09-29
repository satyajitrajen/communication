import React, { useState, useEffect, useCallback } from 'react';
import useAPI from '../../hooks/PostData';
import { DataTable } from 'mantine-datatable';
import { Pagination, Tooltip } from '@mantine/core';
import Dropdown from '../../components/Dropdown';
import Swal from 'sweetalert2';
import FullScreenImageModal from '../Reusable/FullScreenImageModal';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { IoEyeOutline } from 'react-icons/io5';
import { FaUser, FaUserSlash } from 'react-icons/fa';
import Tippy from '@tippyjs/react';

interface User {
    user_id: number;
    user_name: string;
    profile_image: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    country: string;
    country_code: string;
    Blocked_by_admin: boolean;
}

interface UserDetailsProps {
    searchTerm: string;
    searchBy: 'fullName' | 'phoneNumber';
}

const UserDetails: React.FC<UserDetailsProps> = ({ searchTerm, searchBy }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState<any>({ total: 0, pages: 1 });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [updateFlag, setUpdateFlag] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [initialSlide, setInitialSlide] = useState<number>(0);
    const navigate = useNavigate();  // hook to navigate to the new page

    const { postData } = useAPI();

    const handleImageClick = (images: string[], index: number) => {
        setSelectedImages(images);
        setInitialSlide(index);
        setIsModalOpen(true);
    };

    // Fetch Users
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const payload: any = { page: currentPage, limit };
            if (searchBy === 'fullName') {
                payload.fullName = searchTerm;
            } else if (searchBy === 'phoneNumber') {
                payload.phoneNumber = searchTerm;
            }

            const response = await postData('list-all-reported-User', payload);
            console.log(response);

            if (response && response.allUsers) {
                setUsers(response.allUsers.map((user: any) => ({
                    user_id: user.Reported_User.user_id,
                    user_name: user.Reported_User.user_name,
                    profile_image: user.Reported_User.profile_image,
                    first_name: user.Reported_User.first_name,
                    last_name: user.Reported_User.last_name,
                    phone_number: user.Reported_User.phone_number,
                    country: user.Reported_User.country,
                    country_code: user.Reported_User.country_code,
                    Blocked_by_admin: user.Reported_User.Blocked_by_admin,
                    reportCount: user.Reported_User.reportCount
                })));
                setPagination(response.pagination);
            }
        } catch (err: any) {
            setError('Error fetching users');
        } finally {
            setLoading(false);
        }
    }, [searchTerm, searchBy, currentPage, limit, postData]);

    const createTitle = (title: string) => (
        <div className="font-bold p-2 ">{title}</div> // Tailwind CSS classes applied
    );

    const createTitleCenter = (title: string) => (
        <div className="font-bold p-2 text-center">{title}</div> // Tailwind CSS classes applied
    );

    const handleBlock = async (
        user_id: number,
        Blocked_by_admin: boolean,
        profile_image: string,
        first_name: string
    ) => {
        
        const actionText = Blocked_by_admin ? "Unblock" : "Block";
        const confirmationText = Blocked_by_admin
            ? `Do you really want to Unblock user ${first_name}?`
            : `Do you really want to block user ${first_name}?`;
        const confirmButtonText = Blocked_by_admin ? 'Yes, Unblock!' : 'Yes, Block!';

        const result = await Swal.fire({
            html: `
            <div class="flex flex-col items-center justify-center text-center">
                <img src="${profile_image}" alt="User Profile Image" class="rounded-full w-24 h-24 object-cover mb-4">
                <h2 class="text-lg font-semibold mb-2">${actionText} User?</h2>
                <p class="text-base">${confirmationText}</p>
            </div>
        `,
            showCancelButton: true,
            confirmButtonText,
            cancelButtonText: 'No, keep it',
            customClass: {
                confirmButton: 'bg-yellow-500 text-white',
                cancelButton: 'bg-gray-300 text-black'
            },
            padding: '2em',
        });

        if (result.isConfirmed) {
            try {
                const endpoint = Blocked_by_admin ? 'unblock-a-user' : 'block-a-user';
                console.log(user_id,'user_id');
                
                const response = await postData(endpoint,  {user_id} );

                if (response.success === "true") {
                    Swal.fire({
                        icon: 'success',  // Explicitly set to success
                        title: `${actionText}ed!`,
                        text: `User has been ${actionText.toLowerCase()}ed successfully.`,
                        confirmButtonText: 'OK'
                    });
                } else {
                    Swal.fire('Error!', response.message || 'There was an issue with the request.', 'error');
                }

                setUpdateFlag(prev => !prev); // Toggle the update flag to refresh the list or UI
            } catch (error) {
                console.error(`Error ${actionText.toLowerCase()}ing user:`, error);
                Swal.fire('Error!', `There was a problem ${actionText.toLowerCase()}ing the user.`, 'error');
            }
        }
    };


    useEffect(() => {
        fetchUsers();
    }, [searchTerm, searchBy, currentPage, limit, updateFlag]);

    if (loading) return <span className="animate-spin border-[3px] border-transparent border-l-primary rounded-full w-6 h-6 inline-block align-middle m-auto mb-10"></span>;
    if (error) return <div>Error occurred!</div>;

    return (
        <div className='mt-6'>
            <ul className="flex space-x-2 mb-2 rtl:space-x-reverse text-sm text-gray-700">
                <li>
                    <Link to="#" className="text-blue-500 hover:underline">
                        Reports
                    </Link>
                </li>
                <li className=" before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
                    <span>Reported Users</span>
                </li>
            </ul>
            <div className="text-2xl text-dark mb-3 mt-6">Reported Users</div>


            {users.length === 0 ? (
                <div className="my-9 mx- datatables panel">
                    <table className="mt-4 rounded-md bg-white dark:bg-gray-900 dark:text-gray-200">
                        <thead className="bg-gray-800 border-b 0" style={{ fontWeight: 700 }}>
                            <tr>
                                <th className="text-left py-4 font-bold">ID</th>
                                <th className="text-left py-4 font-bold">Full Name</th>
                                <th className="text-left py-4 font-bold">User Name</th>
                                <th className="text-left py-4 font-bold">Country</th>
                                <th className="text-left py-4 font-bold">Country Code</th>
                                <th className="text-center py-4 font-bold">Phone No</th>
                                <th className="text-center py-4 font-bold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan={7} className="my-4 text-center py-4 text-gray-500">
                                    No data available in table
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <DataTable
                    highlightOnHover
                    className="whitespace-nowrap table-hover !overflow-auto slick-thumb panel"
                    records={users}
                    columns={[
                        {
                            accessor: 'user_id',
                            title: createTitle('ID'),
                            render: ({ user_id }) => <strong className="text-info">#{user_id}</strong>,
                        },
                        {
                            accessor: 'first_name',
                            title: createTitle('Full Name'),
                            render: ({ first_name, last_name, profile_image }) => (
                                <div className="flex items-center gap-2">
                                    <div onClick={() => handleImageClick([profile_image], 0)} className="cursor-pointer">
                                        <img src={profile_image} className="w-9 h-9 rounded-full max-w-none"
                                            alt="user-profile" />
                                    </div>
                                    <div className="font-semibold">{first_name + ' ' + last_name}</div>
                                </div>
                            ),
                        },
                        {
                            accessor: 'user_name',
                            title: createTitle('User Name'),
                            render: ({ user_name }) => <div>{user_name}</div>,
                        },
                        {
                            accessor: 'country',
                            title: createTitle('Country'),
                            render: ({ country }) => <div>{country}</div>,
                        },
                        {
                            accessor: 'country_code',
                            title: createTitle('Country Code'),
                            render: ({ country_code }) => <div>{country_code}</div>,
                        },
                        {
                            accessor: 'phone_number',
                            title: createTitle('Phone No'),
                            render: ({ phone_number }) => <div>{phone_number}</div>,
                        },
                        {
                            accessor: 'reportCount',
                            title: createTitle('Report Count'),
                            render: ({ reportCount }) => <div className='ml-10'>{reportCount}</div>,
                        },
                        {
                            accessor: 'action',
                            title: createTitle('Actions'),
                            render: (row) => {
                                const { user_id, Blocked_by_admin, profile_image, first_name } = row;

                                return (
                                    <div className="flex space-x-2 self-center">
                                        {/* View Button */}
                                        <Tippy content="View" placement="top" offset={[0, 0]}>

                                        <button
                                            type="button"
                                            onClick={() => navigate(`/admin/users/reported-user-details/${user_id}`)} // Navigate to the new component with user_id
                                            className="text-green-500 hover:underline text-[20px]" 
                                        >                                            

                                            <IoEyeOutline />
                                        </button>
                                        </Tippy>

                                        {Blocked_by_admin ? (
                                            // If the user is blocked, show the "Unblock" button
                                            <Tippy content="Unblock" placement="right" offset={[0, 10]}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleBlock(user_id, Blocked_by_admin, profile_image, first_name)}
                                                    className="text-blue-500 hover:underline text-[15px]"
                                                >
                                                    <FaUser />
                                                </button>
                                            </Tippy>
                                        ) : (
                                            // If the user is unblocked, show the "Block" button
                                            <Tippy content="Block" placement="right" offset={[0, 10]}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleBlock(user_id, Blocked_by_admin, profile_image, first_name)}
                                                    className="text-red-500 hover:underline text-[18px]"
                                                >
                                                    <FaUserSlash />
                                                </button>
                                            </Tippy>
                                        )}
                                    </div>
                                );
                            },
                        }

                    ]}
                // totalRecords={pagination.total}
                // recordsPerPage={limit}
                // page={currentPage}
                // onPageChange={setCurrentPage}
                />

            )}
            <div className="flex flex-col mt-4 justify-between items-center sm:flex-row lg:flex-row">


                {/* Pagination Controls */}
                <div className="flex items-center text-sm text-dark dark:text-white-light">
                    <span className='font-semibold'>
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
                        {/* Previous Button */}
                        <li>
                            <button
                                type="button"
                                onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
                                disabled={currentPage === 1}
                                className="flex justify-center font-semibold p-2 rounded-full transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                            >
                                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        </li>
                        {[...Array(pagination.pages)].map((_, i) => (
                            <li key={i}>
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`flex justify-center font-semibold px-3.5 py-2 rounded-full transition ${currentPage === i + 1 ? 'bg-primary text-white' : 'bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary'}`}
                                >
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                        <li>
                            <button
                                type="button"
                                onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, pagination.pages))}
                                disabled={currentPage === pagination.pages}
                                className="flex justify-center font-semibold p-2 rounded-full transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                            >
                                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </li>
                    </ul>

                ) :
                    (<div></div>)}
            </div>

            <FullScreenImageModal
                opened={isModalOpen}
                setOpened={setIsModalOpen}
                images={selectedImages}
                initialSlide={initialSlide}
            />
        </div>
    );
};

export default UserDetails;