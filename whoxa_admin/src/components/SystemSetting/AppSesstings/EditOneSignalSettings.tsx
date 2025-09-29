import React, { useState, useEffect, useRef } from 'react';
import useApiPost from '../../../hooks/PostData'; // Adjust the path as necessary
import Swal from 'sweetalert2';
import { useParams, Link } from 'react-router-dom';
import EditGroupSettings from '../GroupSetting/EditGroupSetting';
import EditGogleMapSettings from './EditGogleMapSetting';
import toast from 'react-hot-toast';

interface EditOneSignalSettingsProps {
  setting_id: number; // Change to accept setting_id as a prop
}

function EditOneSignalSettings() {
  const [TWILIO_ACCOUNT_SID, setTWILIO_ACCOUNT_SID] = useState('');
  const [TWILIO_AUTH_TOKEN, setTWILIO_AUTH_TOKEN] = useState('');
  const [TWILIO_FROM_NUMBER, setTWILIO_FROM_NUMBER] = useState('');
  const [email_service, setEmail_service] = useState('');
  const [smtp_host, setsmtp_host] = useState('');
  const [mail_user, setmail_user] = useState('');
  const [mail_password, setmail_password] = useState('');
  const [initialValues, setInitialValues] = useState({
    TWILIO_ACCOUNT_SID: '',
    TWILIO_AUTH_TOKEN: '',
    TWILIO_FROM_NUMBER: '',
    email_service: '',
    smtp_host: '',
    mail_user: '',
    mail_password: '',
  });
  const [isDirty, setIsDirty] = useState(false);
  const { loading, error, postData } = useApiPost();
  const [setting_id, setSetting_id] = useState<number | undefined>();
  const [updateFlag, setUpdateFlag] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await postData('get-website-settings', {});
        console.log(response);

        if (response.success) {
          const settings = response.settings[0];
          if (settings) {
            const { setting_id, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, email_service, smtp_host, mail_user, mail_password } = settings;

            setTWILIO_ACCOUNT_SID(TWILIO_ACCOUNT_SID);
            setTWILIO_AUTH_TOKEN(TWILIO_AUTH_TOKEN);
            setTWILIO_FROM_NUMBER(TWILIO_FROM_NUMBER);
            setEmail_service(email_service);
            setsmtp_host(smtp_host);
            setmail_user(mail_user);
            setmail_password(mail_password);
            setSetting_id(setting_id);

            // Set initial values for comparison
            setInitialValues({
              TWILIO_ACCOUNT_SID,
              TWILIO_AUTH_TOKEN,
              TWILIO_FROM_NUMBER,
              email_service,
              smtp_host,
              mail_user,
              mail_password
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch Twilio settings:', err);
      }
    };

    fetchSettings();
  }, [updateFlag]);

  useEffect(() => {
    // Check if any field has changed
    const hasChanges =
      TWILIO_ACCOUNT_SID !== initialValues.TWILIO_ACCOUNT_SID ||
      TWILIO_AUTH_TOKEN !== initialValues.TWILIO_AUTH_TOKEN ||
      TWILIO_FROM_NUMBER !== initialValues.TWILIO_FROM_NUMBER||
    email_service !== initialValues.email_service ||
    smtp_host !== initialValues.smtp_host ||
    mail_user !== initialValues.mail_user ||
    mail_password !== initialValues.mail_password ;

    setIsDirty(hasChanges);
  }, [TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, email_service,
    smtp_host,
    mail_user,
    mail_password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('TWILIO_ACCOUNT_SID', TWILIO_ACCOUNT_SID);
    formData.append('TWILIO_AUTH_TOKEN', TWILIO_AUTH_TOKEN);
    formData.append('TWILIO_FROM_NUMBER', TWILIO_FROM_NUMBER);
    formData.append('email_service', email_service);
    formData.append('smtp_host', smtp_host);
    formData.append('mail_user', mail_user);
    formData.append('mail_password', mail_password);
    formData.append('setting_id', setting_id?.toString() || '');

    try {
      const response = await postData('edit-website-setting', {
        TWILIO_ACCOUNT_SID,
        TWILIO_AUTH_TOKEN,
        TWILIO_FROM_NUMBER,
        setting_id,
        email_service,
        smtp_host,
        mail_user,
        mail_password,

      });
      if (response.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Settings updated successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        setUpdateFlag(!updateFlag); // Trigger re-fetch
      }
    } catch (err) {
      console.error('Failed to update  settings:', err);
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
          <span>OTP Configuration</span>
        </li>
      </ul>
      <div className="text-2xl text-dark mb-3 mt-3">SMS Configuration</div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5 ">
        <div className='panel'>
          <>
            <div className='text-2xl text-dark mb-5 mt-3'>Twilio Settings</div>

            <div>
              <label htmlFor="TWILIO_ACCOUNT_SID" className="font-bold">
                Twilio Account SID
              </label>
              <input
                id="TWILIO_ACCOUNT_SID"
                type="text"
                value={TWILIO_ACCOUNT_SID}
                onChange={(e) => setTWILIO_ACCOUNT_SID(e.target.value)}
                placeholder="Enter Twilio Account SID"
                className="form-input"
                required
              />
            </div>
            <div>
              <label htmlFor="TWILIO_AUTH_TOKEN" className="font-bold my-2">
                Twilio Auth Token
              </label>
              <input
                id="TWILIO_AUTH_TOKEN"
                type="text"
                value={TWILIO_AUTH_TOKEN}
                onChange={(e) => setTWILIO_AUTH_TOKEN(e.target.value)}
                placeholder="Enter Twilio Auth Token"
                className="form-input"
                required
              />
            </div>
            <div>
              <label htmlFor="TWILIO_FROM_NUMBER" className="font-bold my-2">
                Twilio Phone Number
              </label>
              <input
                id="TWILIO_FROM_NUMBER"
                type="text"
                value={TWILIO_FROM_NUMBER}
                onChange={(e) => setTWILIO_FROM_NUMBER(e.target.value)}
                placeholder="Enter Twilio Phone Number"
                className="form-input"
                required
              />
            </div>
          </>

        </div>
        {/* <div className='panel'>
          <>
            <div className='text-2xl text-dark mb-5 mt-3'>Email Settings</div>

            <div>
              <label htmlFor="email_service" className="font-bold my-2">
                Email Service (e.g. gmail)
              </label>
              <input
                id="email_service"
                type="text"
                value={email_service}
                onChange={(e) => setEmail_service(e.target.value)}
                placeholder="e.g. gmail"
                className="form-input"
                required
              />
            </div>
            <div>
              <label htmlFor="smtp_host" className="font-bold my-2">
                SMTP Host (e.g. smtp.gmail.com)
              </label>
              <input
                id="smtp_host"
                type="text"
                value={smtp_host}
                onChange={(e) => setsmtp_host(e.target.value)}
                placeholder="e.g. smtp.gmail.com"
                className="form-input"
                required
              />
            </div>
            <div>
              <label htmlFor="mail_user" className="font-bold my-2">
                Email ID 
              </label>
              <input
                id="mail_user"
                type="text"
                value={mail_user}
                onChange={(e) => setmail_user(e.target.value)}
                placeholder="Enter email id"
                className="form-input"
                required
              />
            </div>
            <div>
              <label htmlFor="mail_password" className="font-bold my-2">
                Password
              </label>
              <input
                id="mail_password"
                type="text"
                value={mail_password}
                onChange={(e) => setmail_password(e.target.value)}
                placeholder="Enter email id"
                className="form-input"
                required
              />
            </div>
          </>

        </div> */}

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">Failed to update  settings. Please try again.</p>}

        <button type="submit" className="btn btn-primary !mt-6" disabled={!isDirty}>
          Submit
        </button>
      </form>
    </div>
  )
}
export default EditOneSignalSettings;
