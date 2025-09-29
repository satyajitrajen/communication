import React, { useState, useEffect } from 'react';
import useApiPost from '../../hooks/PostData';
import { DataTable } from 'mantine-datatable';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../../components/Reusable/Model'; // Import the Modal component
import AddLanguage from './AddLanguage';
import EditLanguage from './EditLanguage'; // Import the EditLanguage component
import toast from 'react-hot-toast';


interface Language {
  language: string;
  country: string;
  language_alignment: string;
  status: boolean;
  default_status: boolean;
  status_id: number; // Added status_id field
}

const LanguageList: React.FC = () => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [updateFlag, setUpdateFlag] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State for modal visibility
  const [editLanguageData, setEditLanguageData] = useState<Language | null>(null); // State for editing language

  const { postData } = useApiPost();

  const fetchLanguages = async () => {
    setLoading(true);
    try {
      const response = await postData('List-Language', {});
      if (response && response.success) {
        setLanguages(response.languages);
        setError(null);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError('Error fetching languages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, [updateFlag,isModalOpen]);
  const navigate = useNavigate();
  const handleAddNewLanguage = () => {
    setEditLanguageData(null); // Ensure editLanguageData is cleared when adding new language
    setIsModalOpen(true); // Open the modal
  };



  const handleToggle = async (status_id: number, field: 'status' | 'default_status', currentStatus: boolean) => {
    
    const action = field === 'status' ? (currentStatus ? 'Deactivate' : 'Activate') : (currentStatus ? 'Remove as Default' : 'Set as Default');
    const result = await Swal.fire({
      title: `${action} Language`,
      text: `Do you really want to ${action} this language?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: 'No, keep it',
    });

    if (result.isConfirmed) {
      // Prepare the payload to send to the API
      const payload = {
        status_id, // Include status_id in the request
        [field]: !currentStatus, // Toggle the field value
        // Optionally include the other field if needed
        // default_status: field === 'status' ? undefined : !currentStatus
      };

      try {
        // Make the API request to update the status
        const response = await postData('update_status', payload);
        if (response.success) {
          Swal.fire(`${action}d!`, `Language ${action.toLowerCase()}d successfully.`, 'success');
          setUpdateFlag(!updateFlag); // Refresh the list
        } else {
          Swal.fire('Error!', response.message, 'error');
        }
      } catch (error) {
        Swal.fire('Error!', 'There was a problem updating the language.', 'error');
      }
    }
  };


  const handleEdit = (languageData: Language) => {
    console.log(languageData);
    
    setEditLanguageData(languageData); // Set the data for the language being edited
    setIsModalOpen(true); // Open the modal
  };


  const handleTranslate = (status_id: string) => {
    console.log(status_id);

    navigate(`/admin/System-Setting/LanguageSettings/${status_id}`); // Navigate to LanguageSetting with settingId
  };

  if (loading) return <span className="animate-spin border-[3px] border-transparent border-l-primary rounded-full w-6 h-6 inline-block align-middle m-auto mb-10"></span>;
  if (error) return <div>Error occurred!</div>;

  return (
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse text-sm text-gray-700 mb-5 mt-5">
        <li>
          <Link to="#" className="text-blue-500 hover:underline">
            Language Settings
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
          <span>Language List</span>
        </li>
      </ul>
      <div className="text-2xl text-dark mb-3 mt-3">Language List</div>

      <div className="panel">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold dark:text-white">Languages</h2>
          <button onClick={handleAddNewLanguage} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Add New Language
          </button>
        </div>

        {languages.length === 0 ? (
          <div className="my-9 mx- datatables">
            <table className="mt-4 rounded-md bg-white dark:bg-gray-900 dark:text-gray-200">
              <thead className="bg-gray-800 border-b 0" style={{ fontWeight: 700 }}>
                <tr>
                  <th className="text-left py-4 font-bold">Language</th>
                  <th className="text-left py-4 font-bold">Status</th>
                  <th className="text-left py-4 font-bold">Default</th>
                  <th className="text-left py-4 font-bold">Status ID</th> {/* Added Status ID column */}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="my-4 text-center py-4 text-gray-500 hover:bg-gray-50 dark:text-gray-400">
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
            records={languages}
            columns={[
              {
                accessor: 'status_id',
                title: 'ID',
                render: ({ status_id }) => <div>{status_id}</div>,
              },
              {
                accessor: 'language',
                title: 'Language',
                render: ({ language }) => <div className="font-semibold">{language}</div>,
              },
              {
                accessor: 'country',
                title: 'Country',
                render: ({ country }) => (
                  <div className="flex items-center gap-2">
                    <img width="20" src={`/assets/images/flags/${country.substring(0, 2).toUpperCase()}.svg`} className="max-w-none" alt="flag" />
                    <div>{country.substring(0, 2).toUpperCase()}</div>
                  </div>
                ),
              },
              {
                accessor: 'status',
                title: 'Status',
                render: ({ status, status_id }) => (
                  <div
                    onClick={() => handleToggle(status_id, 'status', status)}
                    className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${status ? 'bg-blue-500' : 'bg-gray-300'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${status ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                ),
              },
              {
                accessor: 'default_status',
                title: 'Default',
                render: ({ default_status, status_id }) => (
                  <div
                    onClick={() => handleToggle(status_id, 'default_status', default_status)}
                    className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${default_status ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${default_status ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                ),
              },

              {
                accessor: 'action',
                title: 'Actions',
                render: (row) => {
                  const { status_id } = row;
                  return (
                    <div className="flex space-x-2">
                      <button type="button" onClick={() => handleEdit(row)} className="text-blue-500 hover:underline">
                        Edit
                      </button>
                      <button type="button" onClick={() => handleTranslate(status_id)} className="text-green-500 hover:underline">
                        Translate
                      </button>
                    </div>
                  );
                },
              },
            ]}
            minHeight={200}
          />
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {editLanguageData ? (
          <EditLanguage
            languageName={editLanguageData.language}
            languageCountry={editLanguageData.country} // Ensure this is the country name
            language_alignment={editLanguageData.language_alignment} // Ensure this is the country name
            status_id={editLanguageData.status_id}
            onClose={() => {
              setIsModalOpen(false);
              setUpdateFlag(!updateFlag);
            }}
          />
        ) : (
          <AddLanguage
            onClose={() => {
              setIsModalOpen(false);
              setUpdateFlag(!updateFlag);
            }} // Ensure onClose is handled in AddLanguage too
          /> // Ensure onClose is handled in AddLanguage too
        )}
      </Modal>
    </div>
  );
};

export default LanguageList;
