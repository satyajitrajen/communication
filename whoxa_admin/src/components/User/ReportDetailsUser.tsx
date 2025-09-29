import React, { useEffect, useState } from 'react';
import useApiPost from "../../hooks/PostData";
import { differenceInDays, format, formatDistanceToNow } from 'date-fns';

const ReportDetailsUser = ({ profile_id, report_count }) => {
    const [reportDetails, setReportDetails] = useState();
    const [expandedReportIds, setExpandedReportIds] = useState<Set<number>>(new Set());

    const { postData, loading, error } = useApiPost();
    const reported_user = profile_id
    useEffect(() => {
        const fetchReportDetailsUser = async () => {
            try {
                // Fetch post details
                const reportResponse = await postData('reported-by-user-details', { reported_user });

                if (reportResponse && reportResponse.success == "true") {
                    setReportDetails(reportResponse.reportedUsers);
                    console.log(reportResponse.reportedUsers, "aaa");


                }
                // console.log(reportDetails);

            } catch (err) {
                console.error("Failed to fetch data", err);
            }
        };

        fetchReportDetailsUser();
    }, [profile_id, report_count]);

    const toggleExpand = (commentId: number) => {
        setExpandedReportIds((prev) => {
            const newExpanded = new Set(prev);
            if (newExpanded.has(commentId)) {
                newExpanded.delete(commentId);
            } else {
                newExpanded.add(commentId);
            }
            return newExpanded;
        });
    };
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const daysDifference = differenceInDays(new Date(), date);

        if (daysDifference > 7) {
            return format(date, 'MMM d, yyyy'); // Example: Aug 12, 2024
        }

        const formattedDistance = formatDistanceToNow(date, { addSuffix: true });
        return formattedDistance
            .replace('about', '') // Remove 'about' from 'about x min ago'
            .replace('minute', 'min')
            .replace('minutes', 'mins')
            .replace('hour', 'hr')
            .replace('hours', 'hrs')
            .replace('day', 'day')
            .replace('days', 'days');
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><p className="text-xl">Loading...</p></div>;
    if (error) return <div className="flex justify-center items-center h-screen"><p className="text-xl text-red-600">Error: {error.message}</p></div>;

    return (
        <div className="flex flex-col max-h-[47vh] max-w-xl mx-auto p-4 dark:text-white rounded-lg">

            <div className="flex-1 overflow-y-auto scrollbar pr-4 mb-4" style={{ maxHeight: 'calc(95vh - 12rem)' }}>
                {reportDetails?.length > 0 ? (
                    reportDetails.map((report) => {
                        const timeAgo = formatTime(report.createdAt);
                        const isExpanded = expandedReportIds.has(report.report_id);

                        return (
                            <div key={report.report_id} className="flex flex-col sm:flex-row items-start pt-5 bg-white shadow-md rounded-lg p-4 dark:bg-[#23283e] dark:shadow-none mb-4">
                                <div className="h-12 w-12 flex-none mb-4 sm:mb-0 sm:mr-4">
                                    {report.reporter?.profile_pic && report.reporter?.profile_pic !== "http://192.168.0.27:3008/uploads/profile-image.jpg" ? (
                                        <img src={report.reporter.profile_pic} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold dark:bg-gray-700">
                                            {report.reporter?.first_name?.[0]}{report.reporter?.last_name?.[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-auto">
                                    <div className='flex w-full justify-between'>
                                        <span className="mb-1 text-base font-medium text-gray-900 dark:text-white">
                                            {report.reporter?.first_name} {report.reporter?.last_name}
                                        </span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400 ">{timeAgo}</span>
                                    </div>
                                    <p className={`text-gray-800 dark:text-gray-400 text-sm mb-2 w-full sm:w-72 ${isExpanded ? '' : 'line-clamp-3'}`}>
                                        {report.report_text}
                                    </p>
                                    {report.report_text.split(' ').length > 20 && (
                                        <button
                                            onClick={() => toggleExpand(report.report_id)}
                                            className="text-blue-500 text-sm"
                                        >
                                            {isExpanded ? 'Show Less' : 'Show More'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center text-gray-300 bg-gray-700 w-full h-1/2 rounded-lg">
                        <div className='py-8'>No Reports Yet.</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportDetailsUser;
