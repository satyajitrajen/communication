import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';  // Import useParams
import FullScreenImageModal from '../Reusable/FullScreenImageModal';
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { format, parseISO } from 'date-fns';
import useApiPost from "../../hooks/PostData";

// Define interfaces for the response data
export interface GroupReport {
    id: number;
    createdAt: string;
    updatedAt: string;
    conversation_id: number;
    report_id: number;
    reported_user_id: number | null;
    who_report_id: number;
    Conversation: {
        group_profile_image: string;
        conversation_id: number;
        is_group: boolean;
        group_name: string;
        last_message: string;
        last_message_id: number;
        last_message_type: string;
        blocked_by_admin: boolean;
        createdAt: string;
        updatedAt: string;
    };
}

export interface ReportedGroupResponse {
    success: boolean;
    message: string;
    groups: GroupReport[];
    pagination: {
        total: number;
        pages: number;
        currentPage: number;
    };
}

const ReportedGroupUserList: React.FC = () => {
    const { groupId } = useParams<{ groupId: string }>(); // Get the groupId from the URL path
    const navigate = useNavigate();

    // State for managing the reports and loading
    const [reportList, setReportList] = useState<ReportedGroupResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { postData } = useApiPost();

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Fetch reports based on groupId
    const fetchReports = useCallback(async () => {
        if (!groupId) return; // If no groupId, exit
        setLoading(true);
        try {
            const response = await postData('get-reports-of-group', { conversation_id: parseInt(groupId) });
            if (response && response.success) {
                setReportList(response);
            } else {
                setError(response.message || 'Error fetching reports');
            }
        } catch (err: any) {
            console.error("Error fetching reports:", err);
            setError('Error fetching reports');
        } finally {
            setLoading(false);
        }
    }, [groupId]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    // Navigate back to the previous page
    const handleNavigate = () => {
        navigate('/admin/Group/all-reported-group-list');
    };

    // Open the modal to show the group image
    const openModal = (conversationId: number) => {
        const index = reportList?.groups.findIndex(group => group.Conversation.conversation_id === conversationId) ?? 0;
        setCurrentImageIndex(index);
        setIsModalOpen(true);
    };

    // Close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Handle loading and error states
    if (loading) return (
        <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
            <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent rounded-full w-5 h-5 inline-flex"></span>
        </div>
    );
    if (error) return <p>{error}</p>;

    // Handle when no groupId is provided
    if (!groupId) {
        return <p>No group selected</p>;
    }

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
                        <span>{reportList?.groups[0].Conversation.group_name}</span>
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
                    <h5 className="font-semibold text-lg dark:text-white-light">Group Report List</h5>
                </div>
                <div className="my-9 mx- datatables">
                    <table className="mt-4 rounded-md bg-white dark:bg-gray-900 dark:text-gray-200">
                        <thead className="bg-gray-800" style={{ fontWeight: 700 }}>
                            <tr>
                                <th className="text-left py-4 font-bold">Profile Image</th>
                                <th className="text-left py-4 font-bold">Reported By</th> {/* New column */}
                                <th className="text-left py-4 font-bold">Date of Report</th>
                                <th className="text-left py-4 font-bold">Report Reason</th> {/* New column */}
                                <th className="text-left py-4 font-bold">Blocked By Admin</th>
                            </tr>
                        </thead>

                        <tbody>
                            {reportList?.groups.length > 0 ? (
                                reportList.groups.map((group) => (
                                    <tr key={group.id} className="border-b border-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <td className="p-4 flex items-center">
                                            <div className='overflow-hidden cursor-pointer' onClick={() => openModal(group.Conversation.conversation_id)}>
                                                <img src={group.Who_Reported.profile_image} alt='Profile Image' className="w-9 h-9 rounded-full max-w-none" />
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {/* Display reporter's name */}
                                            {group.Who_Reported ? `${group.Who_Reported.first_name} ${group.Who_Reported.last_name}` : 'Unknown'}
                                        </td>
                                        <td className="p-4">
                                            {format(parseISO(group.createdAt), 'MMMM dd, yyyy')}
                                        </td>   
                                        
                                        <td className="p-4">
                                            {/* Display the report reason */}
                                            {group.ReportType ? group.ReportType.report_title : 'No Reason Provided'}
                                        </td>
                                        <td className="p-4 ">
                                            {group.Who_Reported.blocked_by_admin ?
                                                <span className="inline-block px-2 py-1 text-xs font-semibold text-red-700 bg-red-200 rounded-full capitalize">
                                                    Blocked
                                                </span> :
                                                <span className="inline-block px-3 py-1 text-xs font-semibold text-green-700 bg-lime-200 rounded-full capitalize">
                                                    Active
                                                </span>
                                            }
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="my-4 text-center py-4 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800 dark:text-gray-400">
                                        No data available in table
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
            </div>

            {reportList && (
                <FullScreenImageModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    images={reportList.groups.map(group => group.Conversation.group_profile_image)}
                    initialSlide={currentImageIndex}
                />
            )}
        </div>
    );
};

export default ReportedGroupUserList;
