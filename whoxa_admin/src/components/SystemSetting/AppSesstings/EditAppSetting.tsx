// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import useApiPost from '../../../hooks/PostData'; // Adjust the path as necessary
import Swal from 'sweetalert2';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface EditwebsiteSettingsProps {
    setting_id: number; // Change to accept setting_id as a prop
}

function EditwebsiteSettings() {
    const [appName, setAppName] = useState('');
    const [appText, setAppText] = useState('');
    const [tellFriendLink, setTellFriendLink] = useState('');
    const [androidLink, setAndoidLink] = useState('');
    const [iosLink, setIosLink] = useState('');
    const [appLink, setAppLink] = useState('');
    const [appEmail, setAppEmail] = useState('');
    const [appColorPrimary, setAppColorPrimary] = useState('#000000');
    const [appColorSecondary, setAppColorSecondary] = useState('#ffffff');
    const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
    const [selectedLogoDark, setSelectedLogoDark] = useState<File | null>(null);
    const [previewLogo, setPreviewLogo] = useState<string | null>(null);
    const [previewLogoDark, setPreviewLogoDark] = useState<string | null>(null);
    const [currentLogo, setCurrentLogo] = useState<string | null>(null);
    const [currentLogoDark, setCurrentLogoDark] = useState<string | null>(null);
    const [initialValues, setInitialValues] = useState({
        appName: '',
        appText: '',
        appColorPrimary: '#000000',
        appColorSecondary: '#ffffff',
        currentLogo: null as string | null,
        appEmail: '',
        tellFriendLink: '',
        androidLink: '',
        iosLink: '',
        appLink: ''
    });
    const [isDirty, setIsDirty] = useState(false);
    const { loading, error, postData } = useApiPost(); // Destructure the hook
    const [setting_id, setSetting_id] = useState(1);
    const [updateFlag, setUpdateFlag] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef2 = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Fetch existing settings when the component mounts
        const fetchSettings = async () => {
            try {
                const response = await postData('get-settings', {});

                if (response.success) {
                    const settings = response.settings;

                    if (settings) {
                        const { app_name, app_logo_dark, app_logo, app_text, app_color_primary, app_color_secondary, website_logo, app_email, setting_id, app_link, ios_link, android_link, tell_a_friend_link } = settings[0];
                        console.log("app_logo_dark", app_logo_dark);

                        setAppName(app_name);
                        setAppLink(app_link);
                        setIosLink(ios_link);
                        setAndoidLink(android_link);
                        setTellFriendLink(tell_a_friend_link);
                        setAppText(app_text);
                        setAppColorPrimary(app_color_primary);
                        setAppColorSecondary(app_color_secondary);
                        setCurrentLogo(app_logo); // Set the current logo URL
                        setCurrentLogoDark(app_logo_dark); // Set the current logo URL
                        setAppEmail(app_email);
                        setSetting_id(setting_id);

                        // Set initial values for comparison
                        setInitialValues({
                            appName: app_name,
                            appText: app_text,
                            appLink: app_link,
                            iosLink: ios_link,
                            androidLink: android_link,
                            tellFriendLink: tell_a_friend_link,
                            appColorPrimary: app_color_primary,
                            appColorSecondary: app_color_secondary,
                            currentLogo: website_logo,
                            currentLogoDark: app_logo_dark,
                            appEmail: app_email
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
            appName !== initialValues.appName ||
            appText !== initialValues.appText ||
            appLink !== initialValues.appLink ||
            androidLink !== initialValues.androidLink ||
            iosLink !== initialValues.iosLink ||
            tellFriendLink !== initialValues.tellFriendLink ||
            appColorPrimary !== initialValues.appColorPrimary ||
            appColorSecondary !== initialValues.appColorSecondary ||
            appEmail !== initialValues.appEmail ||
            selectedLogoDark !== null ||
            selectedLogo !== null;

        setIsDirty(hasChanges);
    }, [appName, appText, appColorPrimary, appColorSecondary, selectedLogo, selectedLogoDark, initialValues, appEmail, appLink, androidLink, iosLink, tellFriendLink]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files?.[0];
        if (files) {
            setSelectedLogo(files);
            setPreviewLogo(URL.createObjectURL(files));
        }
    };
    const handleLogoChangeDark = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files?.[0];
        if (files) {
            setSelectedLogoDark(files);
            setPreviewLogoDark(URL.createObjectURL(files));
        }
    };

    const handleRemoveLogo = () => {
       
        setSelectedLogo(null);
        setPreviewLogo(null);
        setCurrentLogo(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset the file input value
        }
    };
    const handleRemoveLogoDark = () => {
        
        setSelectedLogoDark(null);
        setPreviewLogoDark(null);
        setCurrentLogoDark(null);
        if (fileInputRef2.current) {
            fileInputRef2.current.value = ''; // Reset the file input value
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        
        e.preventDefault();
        const formData = new FormData();
        formData.append('app_name', appName);
        formData.append('app_text', appText);
        formData.append('app_link', appLink);
        formData.append('ios_link', iosLink);
        formData.append('android_link', androidLink);
        formData.append('tell_a_friend_link', tellFriendLink);
        formData.append('app_color_primary', appColorPrimary);
        formData.append('app_color_secondary', appColorSecondary);
        formData.append('app_email', appEmail);
        formData.append('setting_id', setting_id?.toString() || '');

        if (selectedLogo) {
            formData.append('files', selectedLogo); // Ensure the logo is appended correctly as a file
        }
        if (selectedLogoDark) {
            formData.append('darkLogo', selectedLogoDark); // Ensure the logo is appended correctly as a file
        }

        try {
            const response = await postData('edit-app-setting', formData, 'multipart/form-data');
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
                    <span>App Setting</span>
                </li>
            </ul>
            <div className="text-2xl text-dark mb-3 mt-3">App Settings</div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-5 ">
                <div className='panel space-y-5 ' >
                    <div>
                        <label htmlFor="appName" className="font-bold">
                            App Name{' '}
                        </label>
                        <input id="appName" type="text" value={appName} onChange={(e) => setAppName(e.target.value)} placeholder="Enter app name" className="form-input" required />
                    </div>

                    <div>
                        <label htmlFor="appEmail" className="font-bold">
                            App Email{' '}
                        </label>
                        <input id="appEmail" type="email" value={appEmail} onChange={(e) => setAppEmail(e.target.value)} placeholder="Enter app email" className="form-input" required />
                    </div>

                    <div>
                        <label htmlFor="appText" className="font-bold">
                            App Text{' '}
                        </label>
                        <textarea id="appText" value={appText} rows={5} onChange={(e) => setAppText(e.target.value)} placeholder="Enter app text" className="form-input" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                        <div className="flex flex-col gap-y-8 mt-5">
                            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                                <div className="w-full">
                                    <label htmlFor="appLogo" className="font-bold">
                                        Upload Logo Light
                                    </label>
                                    <input
                                        id="appLogo"
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleLogoChange}
                                        className="form-input w-full file:py-2 mt-3 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 file:text-white file:hover:bg-primary"
                                        accept="image/*"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <div>
                                        <label htmlFor="appColorPrimary" className="font-bold">
                                            Primary Color
                                        </label>
                                        <input id="appColorPrimary" type="color" value={appColorPrimary} onChange={(e) => setAppColorPrimary(e.target.value)} className="form-input h-16 w-20" />
                                    </div>
                                    <div>
                                        <label htmlFor="appColorSecondary" className="font-bold">
                                            Secondary Color
                                        </label>
                                        <input id="appColorSecondary" type="color" value={appColorSecondary} onChange={(e) => setAppColorSecondary(e.target.value)} className="form-input h-16 w-20" />
                                    </div>
                                </div>
                            </div>

                            {previewLogo || currentLogo ? (
                                <div className="relative w-full sm:w-64 inline-block">
                                    <label className="font-bold">Applogo Light Preview :</label>
                                    <img src={previewLogo || currentLogo} alt="Logo Preview" className="mt-4 w-full rounded-md" />
                                    <button
                                        type="button"
                                        onClick={handleRemoveLogo}
                                        className="absolute top-6 -right-2 bg-blue-600 text-white rounded-full px-2 p-0.5 text-sm"
                                        style={{ transform: 'translate(50%, -50%)' }}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ) : null}
                            <div className="w-full">
                                <label htmlFor="appLogoDark" className="font-bold">
                                    Upload Logo Dark
                                </label>
                                <input
                                    id="appLogoDark"
                                    type="file"
                                    ref={fileInputRef2}
                                    onChange={handleLogoChangeDark}
                                    className="form-input w-full file:py-2 mt-3 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 file:text-white file:hover:bg-primary"
                                    accept="image/*"
                                />
                            </div>
                            {previewLogoDark || currentLogoDark ? (
                                <div className="relative w-full sm:w-64 inline-block">
                                    <label className="font-bold">Applogo Dark Preview:</label>
                                    <img src={previewLogoDark || currentLogoDark} alt="Logo Preview Dark" className="mt-4 w-full rounded-md" />
                                    <button
                                        type="button"
                                        onClick={handleRemoveLogoDark}
                                        className="absolute top-6 -right-2 bg-blue-600 text-white rounded-full px-2 p-0.5 text-sm"
                                        style={{ transform: 'translate(50%, -50%)' }}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {error && <p className="text-red-500">Failed to update app settings. Please try again.</p>}

                    <button type="submit" className="btn btn-primary !mt-6" disabled={!isDirty}>
                        Submit
                    </button>
                </div>
                <div className="text-2xl text-dark mb-3 mt-3">Links</div>

                <div className="flex flex-col space-y-4 pt-5 px-5 panel">
                    <div className="w-full">
                        <label htmlFor="iosLink" className="font-bold">
                            iOS App Link
                        </label>
                        <input
                            id="iosLink"
                            type="text"
                            value={iosLink}
                            onChange={(e) => setIosLink(e.target.value)}
                            placeholder="Enter app name"
                            className="form-input w-full text-blue-600 dark:text-blue-600"
                            required
                        />
                    </div>

                    <div className="w-full">
                        <label htmlFor="androidLink" className="font-bold">
                        Android App Link                        </label>
                        <input
                            id="androidLink"
                            type="text"
                            value={androidLink}
                            onChange={(e) => setAndoidLink(e.target.value)}
                            placeholder="Enter app name"
                            className="form-input w-full text-blue-600 dark:text-blue-600"
                            required
                        />
                    </div>

                    <div className="w-full">
                        <label htmlFor="tellFriendLink" className="font-bold">
                            Tell A Friend Link
                        </label>
                        <textarea
                            id="tellFriendLink"
                            value={tellFriendLink}
                            onChange={(e) => setTellFriendLink(e.target.value)}
                            placeholder="Enter app name"
                            className="form-input w-full text-blue-600 dark:text-blue-600"
                            rows={5}
                            required
                        />
                    </div>
                </div>
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">Failed to update app settings. Please try again.</p>}

                <button type="submit" className="btn btn-primary !mt-6" disabled={!isDirty}>
                    Submit
                </button>
            </form>
        </div>
    );
}

export default EditwebsiteSettings;
