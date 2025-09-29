import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { format, parseISO } from 'date-fns';
import { IoArrowBackCircleOutline } from "react-icons/io5";
import useAPI from '../../hooks/PostData';

const SpecifiedReportUserDetails: React.FC = () => {
    const { user_id } = useParams<{ user_id: string }>();
    const navigate = useNavigate();
    const [reportedUser, setReportedUser] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { postData } = useAPI();

    const fetchReportedUserDetails = useCallback(async () => {
        if (!user_id) {
            setError('User ID is missing!');
            return;
        }
        setLoading(true);
        try {
            const response = await postData('reported_user_details', { user_id: parseInt(user_id) });
            if (response.success) {
                setReportedUser(response);
            } else {
                setError(response.message || 'Error fetching user details');
            }
        } catch (err: any) {
            console.error('Error fetching user details:', err);
            setError('Error fetching user details');
        } finally {
            setLoading(false);
        }
    }, [user_id, postData]);

    useEffect(() => {
        fetchReportedUserDetails();
    }, []);

    const handleNavigateBack = () => {
        navigate('/admin/users/reported-user-list');
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <p>{error}</p>;
    if (!reportedUser) return <div>User not found!</div>;

    const { reported_user_details, allUsers } = reportedUser;

    return (
        <div className="mt-6">
            <div className="flex justify-between items-center mb-6">
                
                <ul className="flex space-x-2 rtl:space-x-reverse text-sm text-gray-700">
                    <li>
                        <Link to="#" className="text-blue-500 hover:underline">
                            Reported User
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
                        <span>{reported_user_details?.first_name + ' ' + reported_user_details?.last_name}</span>
                    </li>
                </ul>

                {/* Title */}
                

                {/* Back button */}
                <button
                    onClick={handleNavigateBack}
                    className="p-2 rounded-full transition-colors duration-200 hover:bg-blue-100 focus:outline-none"
                >
                    <IoArrowBackCircleOutline className="text-3xl text-blue-500 hover:text-blue-700" />
                </button>
            </div>


            <div className="mt-6 panel">
                <div className="my-6">
                    <div className="flex justify-between items-center mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Report List</h5>
                    </div>
                    <table className="mt-4 rounded-md bg-white dark:bg-gray-900 dark:text-gray-200">
                        <thead className="bg-gray-800" style={{ fontWeight: 700 }}>
                            <tr>
                                <th className="p-4 text-left">Reported By</th>
                                <th className="p-4 text-left">Date of Report</th>
                                <th className="p-4 text-left">Report Reason</th>
                                <th className="p-4 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allUsers.length > 0 ? (
                                allUsers.map((report: any) => (
                                    <tr
                                        key={report.id}
                                        className="border-b border-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        <td className="p-4">
                                            {report.Who_Reported
                                                ? `${report.Who_Reported.first_name} ${report.Who_Reported.last_name}`
                                                : 'Unknown'}
                                        </td>
                                        <td className="p-4">
                                            {format(parseISO(report.createdAt), 'MMMM dd, yyyy')}
                                        </td>
                                        <td className="p-4">
                                            {report.ReportType ? report.ReportType.report_title : 'No Reason Provided'}
                                        </td>
                                        <td className="p-4">
                                            {report.Who_Reported.Blocked_by_admin ? (
                                                <span className="inline-block px-2 py-1 text-xs font-semibold text-red-700 bg-red-200 rounded-full capitalize">
                                                    Blocked
                                                </span>
                                            ) : (
                                                <span className="inline-block px-3 py-1 text-xs font-semibold text-green-700 bg-lime-200 rounded-full capitalize">
                                                    Active
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-gray-500">
                                        No reports found for this user.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SpecifiedReportUserDetails;
