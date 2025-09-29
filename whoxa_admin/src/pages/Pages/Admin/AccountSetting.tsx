import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useDispatch, useSelector } from 'react-redux';
import IconHome from '../../../components/Icon/IconHome';
import IconDollarSignCircle from '../../../components/Icon/IconDollarSignCircle';
import { IRootState } from '../../../store';
import useAPI from '../../../hooks/PostData';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { setAdminDetails } from '../../../store/adminSlice';
import IconPencilPaper from '../../../components/Icon/IconPencilPaper';
import IconLockDots from '../../../components/Icon/IconLockDots';
import disableEdit from '../../../utils/disableEdit';
import toast from 'react-hot-toast';

const AccountSetting = () => {
    const admin = useSelector((state: IRootState) => state.admin);
    const { postData, loading } = useAPI();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setPageTitle('Account Setting'));
    }, [dispatch]);

    const [tabs, setTabs] = useState<string>('Profile-Details');
    const [error, setError] = useState<string | null>(null);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState(admin.name);
    const [email, setEmail] = useState(admin.adminEmail);
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const [profilePicPreview, setProfilePicPreview] = useState<string>(admin.profilePic);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleShowPassword = (type: 'old' | 'new' | 'confirm') => {
        switch (type) {
            case 'old':
                setShowOldPassword(prev => !prev);
                break;
            case 'new':
                setShowNewPassword(prev => !prev);
                break;
            case 'confirm':
                setShowConfirmPassword(prev => !prev);
                break;
        }
    };
    const toggleTabs = (name: string) => {
        setTabs(name);
    };

    const showAlert = (type: number) => {
        if (type === 2) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Password updated successfully.',
                padding: '5em',
                customClass: 'sweet-alerts',
            });
        }
        if (type === 3) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Profile updated successfully.',
                padding: '2em',
                customClass: 'sweet-alerts',
            });
        }
        if (type === 4) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'New password and confirm password do not match!',
                padding: '2em',
                customClass: 'sweet-alerts',
            });
        }
        if (type === 5) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please Fill all Password fields',
                padding: '2em',
                customClass: 'sweet-alerts',
            });
        }
        if (type === 6) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please make a little change to submit',
                padding: '2em',
                customClass: 'sweet-alerts',
            });
        }
        if (type === 7) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Current Password is Invalid ',
                padding: '0px',
                customClass: 'sweet-alerts',
            });
        }
    };

    const submitPasswordForm = async (e: React.FormEvent) => {
        e.preventDefault();
       
        console.log(newPassword);

        if (!newPassword || !confirmPassword || !oldPassword) {
            setError('Please Fill all Password fields');
            showAlert(5);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New password and confirm password do not match!');
            showAlert(4);
            return;
        }

        const token = Cookies.get('adminToken');
        if (!token) {
            setError('Token not found. Please login again.');
            navigate('/');
            return;
        }

        try {
            const response = await postData('reset-admin-password', { oldPassword, newPassword, token });
            console.log(response);

            if (!response || response.success === false) {
                showAlert(7);
                setError(response.message || 'Password update failed');

                return;
            } else {
                showAlert(2);
                navigate('/admin/users/user-account-settings');
            }
        } catch (err: any) {
            showAlert(7);
            console.error(err.response?.data?.message || 'An error occurred');
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    const submitProfileForm = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const token = Cookies.get('adminToken');
        if (!token) {
            setError('Token not found. Please login again.');
            navigate('/');
            return;
        }

        const formData = new FormData();
        formData.append('fullName', fullName);
        formData.append('email', email);
        formData.append('token', token);
        if (profilePic) {
            formData.append('files', profilePic);
        }
        if (!fullName && !email && !profilePic) {
            setError('Please make a little change to submit ');
            showAlert(5);
            return;
        }

        try {
            const response = await postData('update-profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Ensure the header is set
                },
            });
            console.log(response);


            if (!response || response.success === false) {
                setError(response.message || 'Profile update failed');
                return;
            } else {
                dispatch(setAdminDetails({
                    name: response.isAdmin.admin_name,
                    profilePic: response.isAdmin.profile_pic,
                    isAdmin: true,
                    adminEmail: email,
                }));
                showAlert(3);
                setError('');
            }
        } catch (err: any) {
            console.error(err.response?.data?.message || 'An error occurred');
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files?.[0];
        if (files) {
            setProfilePic(files);
            setProfilePicPreview(URL.createObjectURL(files));
        }
    };

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="#" className="text-primary hover:underline">
                        Users
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Account Settings</span>
                </li>
            </ul>
            <div className="pt-5">
                <div className="flex items-center justify-between mb-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Settings</h5>
                </div>
                <div>
                    <ul className="sm:flex font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5 whitespace-nowrap overflow-y-auto">
                        <li className="inline-block">
                            <button
                                onClick={() => toggleTabs('Profile-Details')}
                                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'Profile-Details' ? '!border-primary text-primary' : ''}`}
                            >
                                <IconHome />
                                Profile Details
                            </button>
                        </li>
                        <li className="inline-block">
                            <button
                                onClick={() => toggleTabs('change-password')}
                                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'change-password' ? '!border-primary text-primary' : ''}`}
                            >
                                <IconDollarSignCircle />
                                Change Password
                            </button>
                        </li>
                    </ul>
                </div>
                {tabs === 'Profile-Details' && (
                    <div className='mx-36'>
                        <form className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black" onSubmit={submitProfileForm}>
                            <h6 className="text-lg font-bold mb-5">General Information</h6>
                            <div className="flex flex-col sm:flex-row">
                                <div className="relative ltr:sm:mr-4 rtl:sm:ml-4 w-full sm:w-2/12 mb-5">
                                    <img src={profilePicPreview} alt="Profile" className="w-9 h-9 md:w-32 md:h-32 rounded-full object-cover mx-auto" />
                                    <input
                                        type="file"
                                        id="profilePic"
                                        name="profilePic"
                                        accept="image/*"
                                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={handleProfilePicChange}
                                    />
                                    <div className='flex justify-end mx-4'>
                                        <label
                                            htmlFor="profilePic"
                                            className="relative h-11 w-11 flex justify-center items-center bottom-0 right-0 bg-blue-600 p-1 rounded-full cursor-pointer shadow-md"
                                        >
                                            <IconPencilPaper className='text-white' />
                                        </label>
                                    </div>
                                </div>
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="fullName">Full Name</label>
                                        <input
                                            id="fullName"
                                            name="fullName"
                                            type="text"
                                            placeholder="Full Name"
                                            className="form-input"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email">Email</label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="Email"
                                            className="form-input"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="country">Country</label>
                                        <select defaultValue="United States" id="country" className="form-select text-white-dark">
                                            <option value="All Countries">All Countries</option>
                                            <option value="United States">United States</option>
                                            <option value="India">India</option>
                                            <option value="Japan">Japan</option>
                                            <option value="China">China</option>
                                            <option value="Brazil">Brazil</option>
                                            <option value="Norway">Norway</option>
                                            <option value="Canada">Canada</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="address">Address</label>
                                        <input id="address" type="text" placeholder="New York" className="form-input" />
                                    </div>
                                    <div>
                                        <label htmlFor="location">Location</label>
                                        <input id="location" type="text" placeholder="Location" className="form-input" />
                                    </div>
                                    <div>
                                        <label htmlFor="phone">Phone</label>
                                        <input id="phone" type="text" placeholder="+1 (530) 555-12121" className="form-input" />
                                    </div>
                                    <div>
                                        <label htmlFor="web">Website</label>
                                        <input id="web" type="text" placeholder="Enter URL" className="form-input" />
                                    </div>
                                    <div className="sm:col-span-2 mt-3">
                                        <button type="submit" className="btn btn-primary">
                                            {loading ? <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                                <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
                                            </div> : 'Save'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
                {tabs === 'change-password' && (
                    <div className='mx-36'>
                        <form className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black" onSubmit={submitPasswordForm}>
                            <h6 className="text-lg font-bold mb-5">Update Password</h6>
                            <div className="flex flex-col sm:flex-row">
                                <div className="relative ltr:sm:mr-4 rtl:sm:ml-4 w-full sm:w-2/12 mb-5">
                                    <img src={profilePicPreview} alt="Profile" className="w-9 h-9 md:w-32 md:h-32 rounded-full object-cover mx-auto" />


                                </div>
                                <div className="flex-auto grid grid-cols-1 sm:grid-cols-1 gap-5">
                                    <div className="relative">
                                        <label htmlFor="oldPassword">Current Password</label>
                                        <input
                                            id="oldPassword"
                                            name="oldPassword"
                                            type={showOldPassword ? 'text' : 'password'}
                                            placeholder="Current Password"
                                            className="form-input mt-1 block w-full pr-10"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-3 pt-6 right-0 flex items-center px-3"
                                            onClick={() => handleShowPassword('old')}
                                        >
                                            {showOldPassword ? (
                                                <img src="/eye.svg" alt="eye" className='h-5 w-5 text-gray-500' />
                                            ) : (
                                                <img src="/eye-slash.svg" alt="eye" className='h-5 w-5 text-gray-500' />
                                            )}
                                        </button>
                                    </div>
                                    <div></div>
                                    <div className="relative">
                                        <label htmlFor="newPassword">New Password</label>
                                        <input
                                            id="newPassword"
                                            name="newPassword"
                                            type={showNewPassword ? 'text' : 'password'}
                                            placeholder="New Password"
                                            className="form-input mt-1 block w-full pr-10"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="absolute pt-6 inset-y-0 right-0 flex items-center px-3"
                                            onClick={() => handleShowPassword('new')}
                                        >
                                            {showNewPassword ? (
                                                <img src="/eye.svg" alt="eye" className='h-5 w-5 text-gray-500' />
                                            ) : (
                                                <img src="/eye-slash.svg" alt="eye" className='h-5 w-5 text-gray-500' />
                                            )}
                                        </button>
                                    </div>
                                    <div></div>

                                    <div className="relative">
                                        <label htmlFor="confirmPassword">Confirm Password</label>
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="Confirm Password"
                                            className="form-input mt-1 block w-full pr-10"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="absolute pt-6 inset-y-0 right-0 flex items-center px-3"
                                            onClick={() => handleShowPassword('confirm')}
                                        >
                                            {showConfirmPassword ? (
                                                <img src="/eye.svg" alt="eye" className='h-5 w-5 text-gray-500' />
                                            ) : (
                                                <img src="/eye-slash.svg" alt="eye" className='h-5 w-5 text-gray-500' />
                                            )}
                                        </button>
                                    </div>

                                    <div className="sm:col-span-2 mt-3">
                                        <button type="submit" className="btn btn-primary">
                                            {loading ? <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                                <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
                                            </div> : 'Change Password'}
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </form>
                    </div>


                )}
            </div>
        </div>
    );
};

export default AccountSetting;
