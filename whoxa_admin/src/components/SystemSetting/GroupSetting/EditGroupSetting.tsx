//@ts-nocheck
import React, { useState, useEffect } from 'react';
import useApiPost from '../../../hooks/PostData'; // Adjust the path as necessary
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function EditGroupSettings() {
  const [maxMembers, setMaxMembers] = useState<number>(10);
  const [setting_id, setSetting_id] = useState<number>(1);
  const [phone_auth, setPhone_auth] = useState<number>(1);
  const [email_auth, setEmail_auth] = useState<number>(1);
  const [initialMaxMembers, setInitialMaxMembers] = useState<number>(10);
  const [isDirty, setIsDirty] = useState(false);
  const { loading, error, postData } = useApiPost(); // Destructure the hook
  const [updateFlag, setUpdateFlag] = useState(false);
  const [one_signal_app_id, setone_signal_app_id] = useState("xxxxxxxxxxx");
  const [one_signal_api_key, setone_signal_api_key] = useState("xxxxxxxxxxx");

  // State for the toggle
  const [isContact, setIsContact] = useState<boolean>(false); // false = Show Phone Contacts, true = Show All Contacts

  useEffect(() => {
    setIsDirty(false);
    const fetchSettings = async () => {
      try {
        const groupResponse = await postData('get-group-settings', {});
        const appFlowResponse = await postData('get-app-flow', {});
        const webSetting = await postData('get-website-settings', {})

        if (groupResponse.success) {
          const settings = groupResponse.settings;

          if (settings) {
            const { max_members } = settings[0];
            setSetting_id(settings[0].setting_id);
            setMaxMembers(max_members);
            setInitialMaxMembers(max_members);
          }
        }

        // Set the default value for the isContact toggle
        if (appFlowResponse.success) {
          setIsContact(appFlowResponse.appFlow.isContact); // Check your API response structure
        }
        if (webSetting.success) {
          console.log(webSetting);
          
          const { phone_auth, email_auth } = webSetting.settings[0];
          setPhone_auth(phone_auth);
          setEmail_auth(email_auth);
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      }
    };

    fetchSettings();
  }, [updateFlag]);

  useEffect(() => {
    console.log("aaa");
    if (maxMembers !== initialMaxMembers && maxMembers > 0) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  }, [maxMembers, initialMaxMembers]);

  const handlePhoneAuthChange = async (newValue: boolean) => {
    
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${newValue ? 'enable' : 'disable'} phone authentication?`,
      icon: 'warning', // Default icon for a confirmation dialog
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!',
      
    }).then(async (result) => {
      if (result.isConfirmed) {
        setPhone_auth(newValue); // Update local state only after confirmation

        try {
          const response = await postData('edit-app-setting', { phone_auth: newValue ,setting_id:1 });
          if (response.success) {
            Swal.fire({
              title: 'Success!',
              text: 'Phone authentication setting updated successfully.',
              icon: 'success',
              confirmButtonText: 'OK',
            });
          }
        } catch (err) {
          console.error('Failed to update phone authentication setting:', err);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to update phone authentication setting.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      }
    });
  };

  // Handle the email_auth toggle change
  const handleEmailAuthChange = async (newValue: boolean) => {
     
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${newValue ? 'enable' : 'disable'} email authentication?`,
      icon: 'warning', // Default icon for a confirmation dialog
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!',
     
    }).then(async (result) => {
      if (result.isConfirmed) {
        setEmail_auth(newValue); // Update local state only after confirmation

        try {
          const response = await postData('edit-app-setting', { email_auth: newValue, setting_id: 1 });
          if (response.success) {
            Swal.fire({
              title: 'Success!',
              text: 'Email authentication setting updated successfully.',
              icon: 'success',
              confirmButtonText: 'OK',
            });
          }
        } catch (err) {
          console.error('Failed to update email authentication setting:', err);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to update email authentication setting.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      }
    });
  };
  // Handle the isContact toggle change
  const handleIsContactChange = async (newValue: boolean) => {
    
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${newValue ? 'show all contacts' : 'show only phone contacts'}?`,
      iconHtml: `<img src="/3a25b810bfd182641cdd99fde973c192.png" alt="Confirmation Image" style="width: 200px;"/>`,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!',
      customClass: {
        icon: 'no-border'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsContact(newValue); // Update local state only after confirmation

        try {
          const response = await postData('edit-app-flow', { isContact: newValue }); // Call the separate API
          if (response.success) {
            Swal.fire({
              title: 'Success!',
              text: 'Contact setting updated successfully.',
              icon: 'success',
              confirmButtonText: 'OK',
            });
          }
        } catch (err) {
          console.error('Failed to update contact setting:', err);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to update contact setting.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      }
    });
  };

  const handleSubmitMaxMembers = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('setting_id', setting_id.toString());
    formData.append('max_members', maxMembers.toString());

    try {
      const response = await postData('edit-group-settings', formData);
      if (response.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Group settings updated successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        setUpdateFlag(!updateFlag); // Trigger update
      }
    } catch (err) {
      console.error('Failed to update group settings:', err);
    }
  };

  const handleSubmitOneSignal = async (e: React.FormEvent) => {
    
    e.preventDefault();
   
    const formData = new FormData();
    formData.append('ONESIGNAL_APPID', one_signal_app_id);
    formData.append('ONESIGNAL_API_KEY', one_signal_api_key);
    formData.append('setting_id', 1);

    try {
      const response = await postData('edit-One-Signal-setting', formData);

      if (response.success) {
        Swal.fire({
          title: 'Success!',
          text: 'One Signal settings updated successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        setUpdateFlag(!updateFlag); // Trigger update
      }
    } catch (err) {
      console.error('Failed to update One signal settings:', err);
    }
  };

  const renderToggle = (isActive: boolean, onClick: () => void) => (
    <div className="flex items-center space-x-2">
      <div
        onClick={() => {
          onClick();
        }}
        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${isActive ? 'bg-blue-500' : 'bg-gray-300'
          }`}
      >
        <div
          className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${isActive ? 'translate-x-6' : 'translate-x-0'
            }`}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="mt-6">
      <ul className="flex space-x-2 rtl:space-x-reverse text-sm text-gray-700">
        <li>
          <Link to="#" className="text-blue-500 hover:underline">
            System Settings
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
          <span>General Setting</span>
        </li>
      </ul>
      {/* <div className="text-2xl text-dark mb-3 mt-6">Authentication Settings</div>
      <form className="mt-6 space-y-5 panel">

        <table className="mt-4 rounded-md bg-white dark:bg-gray-900 dark:text-gray-200 w-full">
          <thead className="bg-gray-800 text-white">
            <tr className='text-black dark:text-white-dark'>
              <th className="text-left p-4">SL</th>
              <th className="text-left p-4">Title</th>
              <th className="text-left p-4">Description</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-4">1</td>
              <td className="p-4">Phone Authentication</td>
              <td className="p-4">Toggle the Auth flow of the Project for Phone number Authentication </td>
              <td className="p-4">
                {renderToggle(!!phone_auth, () => handlePhoneAuthChange(!phone_auth))}
              </td>
            </tr>
            <tr>
              <td className="p-4">2</td>
              <td className="p-4">Email Authentication</td>
              <td className="p-4">Toggle the Auth flow of the Project for Email Authentication</td>
              <td className="p-4">
                {renderToggle(!!email_auth, () => handleEmailAuthChange(!email_auth))}
              </td>
            </tr>
          </tbody>
        </table>

        {loading && <p className="p-4">Loading...</p>}
        {error && (
          <p className="text-red-500 p-4">
            Failed to update authentication settings. Please try again.
          </p>
        )}
      </form> */}

      <div className="text-2xl text-dark mb-3 mt-3">Group Setting</div>


      <form onSubmit={handleSubmitMaxMembers} className="mt-6 space-y-5 ">

        <div className='panel'>
          <label htmlFor="maxMembers">Maximum Members</label>
          <input
            id="maxMembers"
            type="number"
            value={maxMembers}
            onChange={(e) => setMaxMembers(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="Enter maximum number of members"
            className="form-input"
            required
          />
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">Failed to update group settings. Please try again.</p>}

          <button type="submit" className="btn btn-primary !mt-6" disabled={!isDirty}>
            Submit
          </button>
        </div>
        <div className="text-2xl text-dark mb-3 mt-3">Show Contact Setting</div>

        {/* Two Sliding Toggle Buttons for isContact */}
        <div className="mt-4 panel">
          <table className="mt-4 rounded-md bg-white dark:bg-gray-900 dark:text-gray-200 w-full">
            <thead className="bg-gray-800 text-white">
              <tr className='text-black dark:text-white-dark'>
                <th className="text-left p-4">SL</th>
                <th className="text-left p-4">Title</th>
                <th className="text-left p-4">Description</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4">1</td>
                <td className="p-4">Show All Contacts</td>
                <td className="p-4">Here all the user contacts in the app will be shown</td>
                <td className="p-4">
                  {renderToggle(isContact, () => handleIsContactChange(true))}
                </td>
              </tr>
              <tr>
                <td className="p-4">2</td>
                <td className="p-4">Show Phone Contacts</td>
                <td className="p-4">The numbers saved in the phone are only shown in contacts</td>
                <td className="p-4">
                  {renderToggle(!isContact, () => handleIsContactChange(false))}
                </td>
              </tr>
            </tbody>
          </table>


        </div>

        

      </form>
          <div className="text-2xl text-dark mb-3 mt-6">SMS Configuration</div>
      <form className="mt-6 space-y-5 panel" onSubmit={handleSubmitOneSignal}>
        <div>
          <label htmlFor="one_signal_app_id" className="font-bold">
            OneSignal App ID
          </label>
          <input
            id="one_signal_app_id"
            type="text"
            value={one_signal_app_id}
            onChange={(e) => setone_signal_app_id(e.target.value)}
            placeholder="Enter OneSignal App ID"
            className="form-input"
            required
          />
        </div>
        <div>
          <label htmlFor="one_signal_api_key" className="font-bold">
            OneSignal API Key
          </label>
          <input
            id="one_signal_api_key"
            type="text"
            value={one_signal_api_key}
            onChange={(e) => setone_signal_api_key(e.target.value)}
            placeholder="Enter OneSignal API Key"
            className="form-input"
            required
          />
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">Failed to update One Signal API Key settings. Please try again.</p>}

        <div
          onClick={(e) => { handleSubmitOneSignal(e) }}
          className="cursor-pointer max-w-16 btn btn-primary !mt-6"
        >
          Submit
        </div>
      </form>


    </div>
  );
}

export default EditGroupSettings;
