import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import FullScreenImageModal from '../Reusable/FullScreenImageModal';
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { format, parseISO } from 'date-fns';
import useApiPost from "../../hooks/PostData";

// Define interfaces for user data and response
export interface User {
    profile_image: string;
    user_id: number;
    first_name: string;
    last_name: string;
    user_name: string;
    phone_number: string;
    country: string;
    bio: string;
    gender: string;
    last_seen: number;
}

export interface UserData {
    conversations_user_id: number;
    is_admin: boolean;
    createdAt: string;
    updatedAt: string;
    conversation_id: number;
    user_id: number;
    User: User;
}

export interface UserListResponse {
    success: boolean;
    message: string;
    userData: UserData[];
}

const GroupUserList: React.FC = () => {
    const { groupData } = useParams<{ groupData: string }>(); // Extract the combined group data
    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate('/admin/Group/all-group-list'); // Replace '/desired-route' with your target route
    };

    // Check if groupData is defined and split it
    const [groupId, groupName] = groupData ? groupData.split(',') : ['', ''];

    const [userList, setUserList] = useState<UserListResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { postData } = useApiPost();
    const [limit, setLimit] = useState<number>(10);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

    const fetchUsers = useCallback(async () => {
        if (!groupId) return; // If no groupId, exit
        setLoading(true);
        try {
            const response = await postData('get-all-users-from-group', { conversation_id: parseInt(groupId), page: currentPage, limit });
            if (response && response.success) {
                setUserList(response);
            } else {
                setError(response.message || 'Error fetching users');
            }
        } catch (err: any) {
            setError('Error fetching users');
        } finally {
            setLoading(false);
        }
    }, [groupId, currentPage, limit]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const openModal = (userId: number) => {
        // Find the index of the user in the userList
        const index = userList?.userData.findIndex(user => user.user_id === userId) ?? 0;
        setCurrentImageIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (loading) return (
        <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
            <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent rounded-full w-5 h-5 inline-flex"></span>
        </div>
    );
    if (error) return <p>{error}</p>;

    return (
        <div className="mt-6">
            <div className='flex justify-between items-center'>
                <ul className="flex space-x-2 rtl:space-x-reverse text-sm text-gray-700">
                    <li>
                        <Link to="/admin/Group/all-group-list" className="text-blue-500 hover:underline">
                            Group
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
                        <span>{groupName}</span>
                    </li>
                </ul>
                <button
                    onClick={handleNavigate}
                    className='p-2 rounded-full transition-colors duration-200 hover:bg-blue-100'
                >
                    <IoArrowBackCircleOutline className='text-3xl text-blue-500 hover:text-blue-700' />
                </button>
            </div>

            <div className='mt-6 panel overflow-auto'>
                <div className="flex justify-between items-center mb-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">User List of ({groupName})</h5>

                </div>
                <div className="my-9 mx- datatables">
                    <table className="mt-4 rounded-md bg-white dark:bg-gray-900 dark:text-gray-200">
                        <thead className="bg-gray-800" style={{ fontWeight: 700 }}>
                            <tr>
                                <th className="text-left !py-5 !px-7  font-bold">ID</th>
                                <th className="text-left py-4 font-bold">User Image</th>
                                <th className="text-left py-4 font-bold">User Name</th>
                                <th className="text-left py-4 font-bold">Phone Number</th>
                                <th className="text-left py-4 font-bold">Date of Joining</th>
                                <th className="text-left py-4 font-bold">Role</th>
                            </tr>
                        </thead>
                        {userList?.userData.length > 0 ? (
                            <tbody>
                                {userList?.userData.map((user) => (
                                    <tr key={user.user_id} className="border-b border-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <td className="p-4 "><strong className='text-info'>#{user.user_id}</strong></td>
                                        <td className="p-4 flex items-center">
                                            <div className='overflow-hidden cursor-pointer' onClick={() => openModal(user.user_id)}>
                                                <img src={user.User.profile_image} alt='User Image' className="w-9 h-9 rounded-full max-w-none" />
                                            </div>
                                        </td>
                                        <td className='p-4 '>{user.User.user_name}</td>
                                        <td className='p-4 '>{user.User.phone_number}</td>
                                        <td className='p-4'>
                                            {format(parseISO(user.createdAt), 'MMMM dd, yyyy')}
                                        </td>
                                        <td className='p-4 '>
                                            {
                                                user.is_admin ?
                                                    <span className="inline-block px-2 py-1 text-xs font-semibold text-red-700 bg-red-200 rounded-full capitalize">
                                                        Admin
                                                    </span> :
                                                    <span className="inline-block px-3 py-1 text-xs font-semibold text-green-700 bg-lime-200 rounded-full capitalize">
                                                        User
                                                    </span>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        ) : (
                            <tbody>
                                <tr className=''>
                                    <td colSpan={6} className="my-4 text-center py-4 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800 dark:text-gray-400">
                                        No data available in table
                                    </td>
                                </tr>
                            </tbody>
                        )}
                    </table>
                </div>
            </div>

            {userList && (
                <FullScreenImageModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    images={userList.userData.map(user => user.User.profile_image)}
                    initialSlide={currentImageIndex}
                />
            )}
        </div>
    );
};

export default GroupUserList;
