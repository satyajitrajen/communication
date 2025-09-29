import React, { useState, useEffect, useRef } from 'react';
import useApiPost from '../../../hooks/PostData'; // Adjust the path as necessary
import Swal from 'sweetalert2';
import { useParams, Link } from 'react-router-dom';
import EditGroupSettings from '../GroupSetting/EditGroupSetting';

interface EditOneSignalSettingsProps {
    setting_id: number; // Change to accept setting_id as a prop
}

function EditGogleMapSettings() {
    const [server_key, setServer_key] = useState('');
    const [client_key, setClient_key] = useState('');
    const [initialValues, setInitialValues] = useState({
        server_key: '',
        client_key: '',

    });
    const [isDirty, setIsDirty] = useState(false);
    const { loading, error, postData } = useApiPost(); // Destructure the hook
    const [setting_id, setSetting_id] = useState<number | undefined>();
    const [updateFlag, setUpdateFlag] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Fetch existing settings when the component mounts
        const fetchSettings = async () => {
            try {
                const response = await postData('get-google-maps-settings', {});
                console.log(response);

                if (response.success) {
                    const settings = response.settings;

                    if (settings) {
                        const {setting_id, client_key, server_key } = settings[0];

                        setServer_key(server_key)
                        setClient_key(client_key)
                        setSetting_id(setting_id);

                        // Set initial values for comparison
                        setInitialValues({
                            server_key,
                            client_key
                        });
                    }
                }
            } catch (err) {
                console.error('Failed to fetch google maps settings:', err);
            }
        };

        fetchSettings();
    }, [setting_id, updateFlag]);

    useEffect(() => {
        // Check if any field has changed
        const hasChanges =
            client_key !== initialValues.client_key ||
            server_key !== initialValues.server_key ;

        setIsDirty(hasChanges);
    }, [client_key, server_key]);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('client_key', client_key);
        formData.append('server_key', server_key);
        formData.append('setting_id', setting_id?.toString() || '');


        try {
            const response = await postData('edit-google-maps-setting', {client_key ,server_key,setting_id});
            if (response.success) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Goole Maps settings updated successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                setUpdateFlag(!updateFlag); // Trigger update
            }
        } catch (err) {
            console.error('Failed to update google  Map settings:', err);
        }
    };
    return (
      <div className="mt-6">
        {/* <ul className="flex space-x-2 rtl:space-x-reverse text-sm text-gray-700">
          <li>
            <Link to="#" className="text-blue-500 hover:underline">
              System Settings
            </Link>
          </li>
          <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
            <span>Google maps Settings</span>
          </li>
        </ul> */}
        <div className="text-2xl text-dark mb-3 mt-3">Google maps Settings</div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5 panel">
          <div>
            <label htmlFor="ONESIGNAL_API_KEY" className="font-bold">
              Google maps (Client){' '}
            </label>
            <input id="ONESIGNAL_API_KEY" type="text" value={client_key} onChange={(e) => setClient_key(e.target.value)} placeholder="Enter Client Key" className="form-input" required />
          </div>

          <div>
            <label htmlFor="ONESIGNAL_APPID" className="font-bold">
              Google Maps (Server){' '}
            </label>
            <input id="ONESIGNAL_APPID" type="text" value={server_key} onChange={(e) => setServer_key(e.target.value)} placeholder="Enter Server key" className="form-input" required />
          </div>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">Failed to update Google Maps settings. Please try again.</p>}

          <button type="submit" className="btn btn-primary !mt-6" disabled={!isDirty}>
            Submit
          </button>
        </form>
      </div>
    );
}

export default EditGogleMapSettings;
