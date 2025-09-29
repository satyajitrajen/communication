import React, { useState, useEffect } from 'react';
import useApiPost from '../../hooks/PostData';
import { DataTable } from 'mantine-datatable';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../../components/Reusable/Model'; // Import the Modal component
import AddReport from './AddNewReportType'; // Import the AddReport component
import EditReport from './EditReportType'; // Import the EditReport component

interface Report {
  report_id: number;
  report_title: string;
  report_details: string;
  createdAt: string;
  updatedAt: string;
}

const ReportList: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [updateFlag, setUpdateFlag] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State for modal visibility
  const [editReportData, setEditReportData] = useState<Report | null>(null); // State for editing report

  const { postData } = useApiPost();

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await postData('Report-type-list', {});
      if (response && response.success) {
        setReports(response.reportType);
        setError(null);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError('Error fetching reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [updateFlag, isModalOpen]);

  const navigate = useNavigate();

  const handleAddNewReport = () => {
    setEditReportData(null); // Ensure editReportData is cleared when adding a new report
    setIsModalOpen(true); // Open the modal
  };

  const handleEdit = (reportData: Report) => {
    setEditReportData({
      report_id: reportData.report_id,
      reportTitle: reportData.report_title,
      reportDescription: reportData.report_details,
      reportTypeFor: reportData.report_for,
    });
    setIsModalOpen(true); // Open the modal
  };

 

  if (loading) return <span className="animate-spin border-[3px] border-transparent border-l-primary rounded-full w-6 h-6 inline-block align-middle m-auto mb-10"></span>;
  if (error) return <div>Error occurred!</div>;

  return (
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse text-sm text-gray-700 mb-5 mt-5">
        <li>
          <Link to="#" className="text-blue-500 hover:underline">
            Report Settings
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
          <span>Report List</span>
        </li>
      </ul>
      <div className="text-2xl text-dark mb-3 mt-3">Report List</div>

      <div className="panel">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold dark:text-white">Reports</h2>
          <button onClick={handleAddNewReport} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Add New Report
          </button>
        </div>

        {reports.length === 0 ? (
          <div className="my-9 mx- datatables">
            <table className="mt-4 rounded-md bg-white dark:bg-gray-900 dark:text-gray-200">
              <thead className="bg-gray-800 border-b 0" style={{ fontWeight: 700 }}>
                <tr>
                  <th className="text-left py-4 font-bold">Report ID</th>
                  <th className="text-left py-4 font-bold">Title</th>
                  {/* <th className="text-left py-4 font-bold">Details</th> */}
                  {/* <th className="text-left py-4 font-bold">Report For</th> */}
                  <th className="text-left py-4 font-bold">Created At</th>
                  <th className="text-left py-4 font-bold">Updated At</th>
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
            className="whitespace-nowrap table-hover !overflow-auto"
            records={reports}
            columns={[
              {
                accessor: 'report_id',
                title: 'Report ID',
                render: ({ report_id }) => <div>{report_id}</div>,
              },
              {
                accessor: 'report_title',
                title: 'Title',
                render: ({ report_title }) => <div className="font-semibold">{report_title}</div>,
              },
              // {
              //   accessor: 'report_details',
              //   title: 'Details',
              //   render: ({ report_details }) => <div>{report_details}</div>,
              // },
              // {
              //   accessor: 'report_for',
              //   title: 'Report For',
              //   render: ({ report_for }) => <div>{report_for}</div>,
              // },
              {
                accessor: 'createdAt',
                title: 'Created At',
                render: ({ createdAt }) => <div>{new Date(createdAt).toLocaleString()}</div>,
              },
              {
                accessor: 'updatedAt',
                title: 'Updated At',
                render: ({ updatedAt }) => <div>{new Date(updatedAt).toLocaleString()}</div>,
              },
              {
                accessor: 'action',
                title: 'Actions',
                render: (row) => {
                  const { report_id } = row;
                  return (
                    <div className="flex space-x-2 ml-4">
                      <button
                        type="button"
                        onClick={() => handleEdit(row)}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  );
                },
              },
            ]}
            minHeight={200}
          />
        )}

        {/* Modal for Adding/Editing Reports */}
        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          >
            {editReportData ? (
              <EditReport
                report_id={editReportData.report_id}
                reportTitle={editReportData.reportTitle}
                reportDescription={editReportData.reportDescription}
                reportTypeFor={editReportData.reportTypeFor}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => setUpdateFlag(!updateFlag)}
              />
            ) : (
              <AddReport
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => setUpdateFlag(!updateFlag)}
              />
            )}
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ReportList;
