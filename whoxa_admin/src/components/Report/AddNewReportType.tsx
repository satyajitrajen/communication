import React, { useState } from 'react';
import useApiPost from '../../hooks/PostData'; // Adjust path as necessary
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

interface AddReportTypeProps {
    onClose: () => void;
}

const AddReportType: React.FC<AddReportTypeProps> = ({ onClose }) => {
    const [reportTypeName, setReportTypeName] = useState<string>('');
    const [reportTypeDescription, setReportTypeDescription] = useState<string>('');
    const [reportTypeFor, setReportTypeFor] = useState<string>('');
    const { postData } = useApiPost();
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        // if (!reportTypeName || !reportTypeDescription) {
        //     Swal.fire({
        //         icon: 'warning',
        //         title: 'Validation Error',
        //         text: 'Please fill in all fields.',
        //         confirmButtonText: 'OK',
        //     });
        //     return;
        // }

        
        try {
            const response = await postData('add-new-report-type', {
                report_title: reportTypeName,
                report_details: " ",
                report_for: " ",
            });

            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Report type added successfully.',
                    confirmButtonText: 'OK',
                }).then(() => {
                    navigate('/admin/System-Setting/reportSettings'); // Adjust path as necessary
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Failed to add report type.',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            let errorMessage = 'An error occurred while adding the report type.';

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
                confirmButtonText: 'OK',
            });
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 h-[46vh]">
            <div className='pt-16'>
                <h2 className="text-xl font-bold mb-4">Add New Report Type</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="reportTypeName" className="block text-sm font-medium text-gray-700">
                            Report Type Name
                        </label>
                        <input
                            id="reportTypeName"
                            type="text"
                            value={reportTypeName}
                            onChange={(e) => setReportTypeName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm lg:text-lg px-3 py-2"
                            aria-required="true"
                            required
                        />
                    </div>
                    {/* <div>
                        <label htmlFor="reportTypeDescription" className="block text-sm font-medium text-gray-700">
                            Report Type Description
                        </label>
                        <textarea
                            id="reportTypeDescription"
                            value={reportTypeDescription}
                            onChange={(e) => setReportTypeDescription(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm lg:text-lg px-3 py-2"
                            aria-required="true"
                            required
                        />
                    </div> */}
                    {/* <div>
                        <label htmlFor="reportTypeFor" className="block text-sm font-medium text-gray-700">
                            Report Type Name
                        </label>
                        <input
                            id="reportTypeFor"
                            type="text"
                            value={reportTypeFor}
                            onChange={(e) => setReportTypeFor(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm lg:text-lg px-3 py-2"
                            aria-required="true"
                            required
                        />
                    </div> */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Add Report Type
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddReportType;
