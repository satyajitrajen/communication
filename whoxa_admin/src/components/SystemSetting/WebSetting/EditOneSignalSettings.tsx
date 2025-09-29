import React, { useState, useEffect, useRef } from 'react';
import useApiPost from '../../../hooks/PostData'; // Adjust the path as necessary
import Swal from 'sweetalert2';
import { useParams, Link } from 'react-router-dom';
import EditGroupSettings from '../GroupSetting/EditGroupSetting';
import EditGogleMapSettings from './EditGogleMapSetting';

interface EditOneSignalSettingsProps {
    setting_id: number; // Change to accept setting_id as a prop
}

function EditOneSignalSettings() {
    const [ONESIGNAL_APPID, setONESIGNAL_APPID] = useState('');
    const [ONESIGNAL_API_KEY, setONESIGNAL_API_KEY] = useState('');
    const [initialValues, setInitialValues] = useState({
        ONESIGNAL_APPID: '',
        ONESIGNAL_API_KEY: '',

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
                const response = await postData('get-OneSignal-settings', {});
                console.log(response);

                if (response.success) {
                    const settings = response.settings;

                    if (settings) {
                        const {setting_id, ONESIGNAL_API_KEY, ONESIGNAL_APPID } = settings[0];

                        setONESIGNAL_API_KEY(ONESIGNAL_API_KEY)
                        setONESIGNAL_APPID(ONESIGNAL_APPID)
                        setSetting_id(setting_id);

                        // Set initial values for comparison
                        setInitialValues({
                            ONESIGNAL_API_KEY,
                            ONESIGNAL_APPID
                        });
                    }
                }
            } catch (err) {
                console.error('Failed to fetch app settings:', err);
            }
        };

        fetchSettings();
    }, [setting_id, updateFlag]);

    useEffect(() => {
        // Check if any field has changed
        const hasChanges =
            ONESIGNAL_API_KEY !== initialValues.ONESIGNAL_API_KEY ||
            ONESIGNAL_APPID !== initialValues.ONESIGNAL_APPID ;

        setIsDirty(hasChanges);
    }, [ONESIGNAL_APPID, ONESIGNAL_API_KEY]);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('ONESIGNAL_API_KEY', ONESIGNAL_API_KEY);
        formData.append('ONESIGNAL_APPID', ONESIGNAL_APPID);
        formData.append('setting_id', setting_id?.toString() || '');


        try {
            const response = await postData('edit-One-Signal-setting', {ONESIGNAL_API_KEY ,ONESIGNAL_APPID ,setting_id});
            if (response.success) {
                Swal.fire({
                    title: 'Success!',
                    text: 'App settings updated successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                // Optionally reset the form or perform other actions here
                setUpdateFlag(!updateFlag); // Trigger update
            }
        } catch (err) {
            console.error('Failed to update app settings:', err);
        }
    };
    return (
      <div className="mt-6">
        <ul className="flex space-x-2 rtl:space-x-reverse text-sm text-gray-700">
          <li>
            <Link to="#" className="text-blue-500 hover:underline">
              System Settings
            </Link>
          </li>
          <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
            <span>Advanced Settings</span>
          </li>
        </ul>
        <div className="text-2xl text-dark mb-3 mt-3">Notification Settings</div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5 panel">
          <div>
            <label htmlFor="ONESIGNAL_API_KEY" className="font-bold">
              One Signal API Key{' '}
            </label>
            <input id="ONESIGNAL_API_KEY" type="text" value={ONESIGNAL_API_KEY} onChange={(e) => setONESIGNAL_API_KEY(e.target.value)} placeholder="Enter OneSignal" className="form-input" required />
          </div>

          <div>
            <label htmlFor="ONESIGNAL_APPID" className="font-bold">
              One Signal App Id{' '}
            </label>
            <input
              id="ONESIGNAL_APPID"
              type="text"
              value={ONESIGNAL_APPID}
              onChange={(e) => setONESIGNAL_APPID(e.target.value)}
              placeholder="Enter One signal APP Id"
              className="form-input"
              required
            />
          </div>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">Failed to update One Signal settings. Please try again.</p>}

          <button type="submit" className="btn btn-primary !mt-6" disabled={!isDirty}>
            Submit
          </button>
        </form>
        <EditGogleMapSettings/>
      </div>
    );
}

export default EditOneSignalSettings;
