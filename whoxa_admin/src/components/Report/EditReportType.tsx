import React, { useState, useEffect } from 'react';
import useApiPost from '../../hooks/PostData';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

interface EditReportTypeProps {
    report_id: string; // ID of the report type to be updated
    reportTitle: string; // Initial title of the report
    reportDescription: string; // Initial description of the report
    onClose: () => void; // Function to call when closing the form
}

const EditReportType: React.FC<EditReportTypeProps> = ({ report_id, reportTitle: initialReportTitle, reportDescription: initialReportDescription, reportTypeFor:intialReportTypeFor, onClose }) => {
    const [reportTitle, setReportTitle] = useState<string>(initialReportTitle);
    const [reportDescription, setReportDescription] = useState<string>(initialReportDescription);
    const [reportTypeFor, setReportTypeFor] = useState<string>(intialReportTypeFor);
    const { postData } = useApiPost();

    useEffect(() => {
        // Initialize the form with initial values if provided
        setReportTitle(initialReportTitle);
        setReportDescription(initialReportDescription);
        setReportTypeFor(intialReportTypeFor);
    }, [initialReportTitle, initialReportDescription, intialReportTypeFor]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!reportTitle || !reportDescription|| !reportTypeFor) {
            Swal.fire({
                icon: 'warning',
                title: 'Validation Error',
                text: 'Please fill in all fields.',
                confirmButtonText: 'OK',
            });
            return;
        }

        try {
            const response = await postData('update-report-type', {
                report_id,
                report_title: reportTitle,
                report_details: reportDescription,
                report_for: reportTypeFor,
            });

            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Report type updated successfully.',
                    confirmButtonText: 'OK',
                }).then(() => onClose());
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Failed to update report type.',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while updating the report type.',
                confirmButtonText: 'OK',
            });
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 h-[46vh]">
            <div className="pt-16">
                <h2 className="text-xl font-bold mb-4">Edit Report Type</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="reportTitle" className="block text-sm font-medium text-gray-700">
                            Report Title
                        </label>
                        <input
                            id="reportTitle"
                            type="text"
                            value={reportTitle}
                            onChange={(e) => setReportTitle(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm lg:text-lg px-3 py-2"
                            aria-required="true"
                            required
                        />
                    </div>
                    {/* <div>
                        <label htmlFor="reportDescription" className="block text-sm font-medium text-gray-700">
                            Report Description
                        </label>
                        <textarea
                            id="reportDescription"
                            value={reportDescription}
                            onChange={(e) => setReportDescription(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm lg:text-lg px-3 py-2"
                            aria-required="true"
                            required
                            rows={3}
                        />
                    </div>
                    <div>
                        <label htmlFor="reportTypeFor" className="block text-sm font-medium text-gray-700">
                            Report For
                        </label>
                        <textarea
                            id="reportTypeFor"
                            value={reportTypeFor}
                            onChange={(e) => setReportTypeFor(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm lg:text-lg px-3 py-2"
                            aria-required="true"
                            required
                            rows={3}
                        />
                    </div> */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Update Report Type
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditReportType;
