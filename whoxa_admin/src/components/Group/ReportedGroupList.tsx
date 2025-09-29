import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import FullScreenImageModal from '../Reusable/FullScreenImageModal';
import useApiPost from '../../hooks/PostData';
import toast from 'react-hot-toast';
import { Modal } from '@mantine/core';
import ReportedGroupUserList from './ReportedUserGroupList';
import { IoEyeOutline } from 'react-icons/io5';
import { MdGroup, MdGroupOff } from 'react-icons/md';

export interface ReportedGroup {
    group_profile_image: string;
    conversation_id: number;
    group_name: string;
    last_message: string;
    last_message_id: number;
    last_message_type: string;
    blocked_by_admin: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Pagination {
    total: number;
    pages: number;
    currentPage: number;
}

export interface ReportedGroupResponse {
    success: boolean;
    message: string;
    groups: ReportedGroup[];
    pagination: Pagination;
}

// Inside ReportedGroupList component


const ReportedGroupList: React.FC = () => {
    const [reportedGroups, setReportedGroups] = useState<ReportedGroupResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const { postData } = useApiPost();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
    const [selectedGroupID, setSelectedGroupID] = useState<number | null>(null); // State for selected group ID
    const navigate = useNavigate();

    const fetchReportedGroups = useCallback(async () => {
        setLoading(true);
        try {
            const response = await postData('reported_group_list', { page: currentPage, limit });
            if (response && response.success) {
                setReportedGroups(response);
            } else {
                setError('Error fetching reported groups');
            }
        } catch (err) {
            setError('Error fetching reported groups');
        } finally {
            setLoading(false);
        }
    }, [currentPage, limit, postData]);

    useEffect(() => {
        fetchReportedGroups();
    }, [currentPage, limit]);

    const openModal = (index: number) => {
        setCurrentImageIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    const openViewModal = (groupId: number) => {
        console.log("Opening modal for groupId:", groupId);  // Add a log here to check
        setSelectedGroupID(groupId);  // Set the selected group ID
        setIsViewModalOpen(true);  // Open the modal
        navigate(`/admin/Group/all-reported-group-list/${groupId}`);  // Update URL with the groupId
    };



    const closeViewModal = () => {
        setIsViewModalOpen(false); // Close the modal
        setSelectedGroupID(null); // Clear selected group ID
    };

    const handleToggleBlock = async (group: ReportedGroup) => {
       
        const action = group.blocked_by_admin ? 'Unblock' : 'Block';
        const result = await Swal.fire({
            icon: 'question',
            title: `Are you sure you want to ${action} this '${group.group_name}' group?`,
            showCancelButton: true,
            confirmButtonText: `Yes, ${action} it!`,
            cancelButtonText: 'No, keep it as is',
        });

        if (result.isConfirmed) {
            try {
                const response = await postData('block-a-Group', { conversation_id: group.conversation_id });
                if (response.success) {
                    Swal.fire(`${action}ed!`, `The group has been ${action.toLowerCase()}ed.`, 'success');
                    fetchReportedGroups();
                } else {
                    Swal.fire('Error!', response.message, 'error');
                }
            } catch (error) {
                Swal.fire('Error!', 'Something went wrong while updating the group status.', 'error');
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <p>{error}</p>;

    return (
        <div className="mt-6">
            <ul className="flex space-x-2 mb-2 rtl:space-x-reverse text-sm text-gray-700">
                <li>
                    <Link to="#" className="text-blue-500 hover:underline">
                        Reports
                    </Link>
                </li>
                <li className=" before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
                    <span>Reported Groups</span>
                </li>
            </ul>
            <div className="text-2xl text-dark mb-3 mt-6">Reported Groups</div>

            <div className="mt-6 panel overflow-auto">
                <div className="flex justify-between items-center mb-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Group List</h5>
                </div>
                <div className="my-9 mx- datatables">
                    <table className="table-auto w-full bg-white shadow-md">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="px-4 py-2">ID</th>
                                <th className="px-4 py-2">Group Image</th>
                                <th className="px-4 py-2">Group Name</th>
                                <th className="px-4 py-2">Created At</th>
                                <th className="px-4 py-2">Report Count</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportedGroups?.groups.map((group, index) => (
                                <tr key={group.conversation_id} className="border-b">
                                    <td className="px-4 py-2">
                                        <strong className="text-info">
                                            #{group.conversation_id}
                                        </strong>
                                    </td>
                                    <td className="px-4 py-2">
                                        <img
                                            src={group.group_profile_image}
                                            alt={group.group_name}
                                            className="w-10 h-10 rounded-full cursor-pointer"
                                            onClick={() => openModal(index)}
                                        />
                                    </td>
                                    <td className="px-4 py-2">{group.group_name}</td>
                                    <td className="px-4 py-2">{format(new Date(group.createdAt), 'MMMM dd, yyyy')}</td>
                                    <td className="px- py-2 ">{group.report_count}</td>
                                    <td className="px-4 py-2 flex gap-x-4">
                                        <Tippy content="View" placement="top" offset={[0, 0]}>
                                            <button
                                                onClick={() => openViewModal(group.conversation_id)} // Open modal with group ID
                                                className="flex items-center px- py-2 text-green-500 hover:underline  rounded-md transition-colors duration-300 text-[20px]"
                                            >
                                                <IoEyeOutline />

                                            </button>
                                        </Tippy>

                                        <Tippy
                                            content={group.blocked_by_admin ? "Unblock" : "Block"}
                                            placement="right"
                                            offset={[0, 10]}
                                        >
                                            <button
                                                className={` ${group.blocked_by_admin ? 'text-blue-500 text-[20px]' : 'text-red-500 text-[20px]'}`}
                                                onClick={() => handleToggleBlock(group)}
                                            >
                                                {group.blocked_by_admin ? <MdGroup /> : <MdGroupOff />}
                                            </button>
                                        </Tippy>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex flex-col mt-4 justify-between items-center sm:flex-row lg:flex-row">

                        {/* Pagination Controls */}
                        <div className="flex items-center text-sm text-dark dark:text-white-light">
                            <span className="font-semibold">
                                Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, reportedGroups?.pagination.total)} of {reportedGroups?.pagination.total} entries
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
                        <div className="flex flex-col mt-4 justify-between items-center sm:flex-row lg:flex-row">

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
                                {/* Page Number Buttons */}
                                {Array.from({ length: reportedGroups?.pagination.pages }, (_, i) => (
                                    <li key={i}>
                                        <button
                                            type="button"
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`flex justify-center font-semibold px-3.5 py-2 rounded-full transition ${currentPage === i + 1
                                                ? 'bg-primary text-white'
                                                : 'bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary'
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
                                        onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, reportedGroups?.pagination.pages))}
                                        disabled={currentPage === reportedGroups?.pagination.pages}
                                        className="flex justify-center font-semibold p-2 rounded-full transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                                    >
                                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <FullScreenImageModal
                isOpen={isModalOpen}
                onClose={closeModal}
                images={reportedGroups?.groups.map((group) => group.group_profile_image) || []}
                initialSlide={currentImageIndex}
            />
            {/* Modal for displaying GroupUserList */}
            <Modal isOpen={isViewModalOpen} onClose={closeViewModal}>
                {selectedGroupID !== null && <ReportedGroupUserList groupId={selectedGroupID} />}
            </Modal>

        </div>
    );
};

export default ReportedGroupList;

