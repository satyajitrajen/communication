import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { FaTrashAlt } from 'react-icons/fa';
import useApiPost from "../../hooks/PostData";
import { Link } from 'react-router-dom';
import { DataTable } from 'mantine-datatable';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import FullScreenImageModal from '../Reusable/FullScreenImageModal';
import Modal from '../Reusable/Model';
import { FiEye } from "react-icons/fi";
import GroupUserList from './GroupUserList';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export interface Welcome {
  success: boolean;
  message: string;
  avtars: avtars[];
  pagination: Pagenation;
}

export interface Pagenation {
  count: number;
  currentPage: number;
  totalPages: number;
}

export interface avtars {
  avtar_Media: string;
  avatar_id: number;
  avatar_name: string;
  avatar_gender: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const GroupList: React.FC = () => {
  const [groupres, setGroupres] = useState<Welcome>()
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { postData, } = useApiPost();
  const [updateFlag, setUpdateFlag] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(10);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isViewModalOpen, setisViewModalOpen] = useState<boolean>(false);
  const [selectedGruoupID, setSelectedGruoupID] = useState<number | null>(0);
  const [selectedGruoupName, setSelectedGruoupName] = useState<string | null>(0);

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  const handleToggle = async (avt: avtars) => {
    const result = await Swal.fire({
      icon: 'question',
      title: 'Are you sure?',
      text: `Do you really want to update the status of Avtar ${avt.avatar_name}?`,
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, keep it',
      customClass: {
        confirmButton: 'bg-red-500 text-white',
        cancelButton: 'bg-gray-300 text-black'
      },
      padding: '2em',
    });

    if (result.isConfirmed) {
      try {
        const response = await postData('update-avtar-status', { avatar_id: avt.avatar_id });
        if (response.success) {
          Swal.fire('Updated!', 'Avtar status has been updated successfully.', 'success');
          setUpdateFlag(prev => !prev); // Trigger re-render
        } else {
          Swal.fire('Error!', response.message, 'error');
        }
      } catch (error) {
        console.error('Error updating Avtar status:', error);
        Swal.fire('Error!', 'There was a problem updating the Avtar status.', 'error');
      }
    }
  };

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const response = await postData('get-all-groups', { page: currentPage, limit });

      console.log(response);

      if (response && response.success === true) {
        setGroupres(response)
        // setReportedUsers(response.isReportedUsers);
        // setTotalPages(response.pagination.pages);
      } else if (response.message === 'No Avtars found') {

        setError('No Avtar')
        const result = await Swal.fire({
          icon: 'error',
          title: 'No Groups',
          text: 'Do you want to go on Home Page',
          // showCancelButton: true,
          confirmButtonText: 'Okay',
          customClass: {
            confirmButton: 'bg-yellow-500 text-white',
          },
          padding: '2em',
        })

      }
      else {
        setError('Error fetching Groups');
      }
    } catch (err: any) {
      setError('Error fetching Groups');
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, postData]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isViewModalOpen && selectedGruoupID !== null) {


      navigate(`/admin/Group/all-user-list-from-group/${selectedGruoupID},${selectedGruoupName}`);
    }
  }, [isViewModalOpen, selectedGruoupID, navigate]);

  useEffect(() => {
    fetchGroups();
  }, [currentPage, updateFlag, limit, isViewModalOpen]);




  const onEdit = (id: number) => {
    setSelectedAvatarId(id);

    setisViewModalOpen(true);
  };
  const onView = (id: number, name: string) => {
    setSelectedGruoupID(id);
    setSelectedGruoupName(name);

    setisViewModalOpen(true);
  };
  const closeEditModal = () => {
    setisViewModalOpen(false);
    setSelectedGruoupID(null); // Reset the selected ID
  };


  const handleDelete = async (avt: avtars) => {
    const result = await Swal.fire({
      icon: 'question',
      title: 'Are you sure?',
      text: `Do you really want to delete Avtar ${avt.avatar_name}?`,
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      customClass: {
        confirmButton: 'bg-red-500 text-white',
        cancelButton: 'bg-gray-300 text-black'
      },
      padding: '2em',
    });

    if (result.isConfirmed) {
      try {
        const response = await postData('delete-avatar', { avatar_id: avt.avatar_id });
        if (response.success === true) {
          Swal.fire('Deleted!', 'Avtar has been deleted successfully.', 'success');
          setUpdateFlag(prev => !prev);
          // setReportedUsers(reportedUsers.filter(u => u.user_id !== user.user_id));
        } else {
          Swal.fire('Error!', response.message, 'error');
          setUpdateFlag(prev => !prev);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        Swal.fire('Error!', 'There was a problem deleting the Avatar.', 'error');
      }

    }
  };



  if (loading) return <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
    <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
  </div>;
  if (error) return <p>{error}</p>;
  return (
    <div className="mt-6">
      <ul className="flex space-x-2 rtl:space-x-reverse text-sm text-gray-700">
        <li>
          <Link to="#" className="text-blue-500 hover:underline">
            Group
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
          <span>Group List</span>
        </li>
      </ul>
      <div className="text-2xl text-dark mb-3 mt-3">Group List</div>

      <div className="mt-6 panel overflow-auto">
        <div className="flex justify-between items-center mb-5">
          <h5 className="font-semibold text-lg dark:text-white-light">Group List</h5>
        </div>
        <div className="my-9 mx- datatables">
          <table className="mt-4 rounded-md bg-white dark:bg-gray-900 dark:text-gray-200">
            <thead className="bg-gray-800 " style={{ fontWeight: 700 }}>
              <tr>
                <th className="text-left !py-5 !px-7  font-bold ">ID</th>
                <th className="text-left py-4 font-bold">Group Image</th>
                <th className="text-left py-4 font-bold">Group Name</th>
                <th className="text-left py-4 font-bold">Created At</th>
                <th className="text-center py-4 font-bold">Total Users</th>
                <th className="text-center py-4 font-bold">Actions</th>
              </tr>
            </thead>
            {groupres?.groups.length > 0 ? (
              <tbody>
                {groupres?.groups.map((group: any, index) => (
                  <tr key={group.Groupid} className="border-b border-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <td className="p-4 ">
                      <strong className="text-info">#{group.Groupid}</strong>
                    </td>
                    <td className="p-4 flex items-center">
                      <div className="overflow-hidden cursor-pointer" onClick={() => openModal(index)}>
                        <img src={group.GroupProfile} alt="Wallpaper Image" className="w-9 h-9 rounded-full max-w-none" />
                      </div>
                    </td>
                    <td className="p-4 ">{group.groupname}</td>
                    <td className="p-4">{format(new Date(group.CreatedAt), 'MMMM dd, yyyy')}</td>
                    <td className="p-4 text-center">{group.GroupTotalUsersCount}</td>

                    <td className="p-4">
                      <div className="flex justify-center">
                        <Tippy content="View" placement="top" offset={[0, 0]}>
                          <button onClick={() => onView(group.Groupid, group.groupname)} className="flex items-center px- py-2 text-black dark:text-white  rounded-md transition-colors duration-300">
                            <span className="btn btn-info btn-sm">View Users</span>
                          </button>
                        </Tippy>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr className="">
                  <td colSpan={5} className="my-4 text-center py-4 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800 dark:text-gray-400">
                    No data available in table
                  </td>
                </tr>
              </tbody>
            )}
          </table>

          <div className="flex flex-col mt-4 justify-between items-center sm:flex-row lg:flex-row">
            {/* Pagination Controls */}
            <div className="flex items-center text-sm text-dark dark:text-white-light">
              <span className="font-semibold">
                Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, groupres?.totalGroups)} of {groupres?.totalGroups} entries
              </span>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="appearance-none text-dark border-gray-300 border-[1px] rounded-md dark:bg-[#191e3a] dark:text-white-light ml-2 px-4 py-0.5 focus:outline-none  "
              >
                {[10, 20, 50].map((option) => (
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
            {groupres?.groups.length > 0 ? (
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
                {[...Array(groupres?.totalPages)].map((_, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => setCurrentPage(i + 1)}
                      className={`flex justify-center font-semibold px-3.5 py-2 rounded-full transition ${
                        currentPage === i + 1 ? 'bg-primary text-white' : 'bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary'
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
                    onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, groupres?.totalPages))}
                    disabled={currentPage === groupres?.totalPages}
                    className="flex justify-center font-semibold p-2 rounded-full transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                  >
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </li>
              </ul>
            ) : (
              <div> </div>
            )}
          </div>
        </div>
      </div>
      <FullScreenImageModal isOpen={isModalOpen} onClose={closeModal} images={groupres?.groups.map((gerpimg) => gerpimg.GroupProfile) || []} initialSlide={currentImageIndex} />
      <Modal isOpen={isViewModalOpen} onClose={closeEditModal}>
        {setSelectedGruoupID !== null && <GroupUserList groupId={selectedGruoupID} />}
      </Modal>
    </div>
  );
};

export default GroupList;
