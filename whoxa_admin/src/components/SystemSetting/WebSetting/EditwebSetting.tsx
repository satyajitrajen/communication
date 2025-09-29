import React, { useState, useEffect, useRef } from 'react';
import useApiPost from '../../../hooks/PostData';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function EditWebSettings() {
    const [websiteName, setWebsiteName] = useState('');
    const [websiteText, setWebsiteText] = useState('');
    const [websiteLink, setWebsiteLink] = useState('');
    const [iosLink, setIosLink] = useState('');
    const [androidLink, setAndroidLink] = useState('');
    const [tellFriendLink, setTellFriendLink] = useState('');
    const [websiteEmail, setWebsiteEmail] = useState('');
    const [websiteColorPrimary, setWebsiteColorPrimary] = useState('#000000');
    const [websiteColorSecondary, setWebsiteColorSecondary] = useState('#ffffff');
    const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
    const [previewLogo, setPreviewLogo] = useState<string | null>(null);
    const [currentLogo, setCurrentLogo] = useState<string | null>(null);
    const [selectedFavicon, setSelectedFavicon] = useState<File | null>(null);
    const [previewFavicon, setPreviewFavicon] = useState<string | null>(null);
    const [currentFavicon, setCurrentFavicon] = useState<string | null>(null);
    const [isDirty, setIsDirty] = useState(false);
    const { postData } = useApiPost();
    const [setting_id, setSetting_id] = useState(1);
    const [updateFlag, setUpdateFlag] = useState(false);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const faviconInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await postData('get-website-settings', {});
                console.log();
                
                if (response.success) {
                    const settings = response.settings[0];
                    setWebsiteName(settings.website_name);
                    setWebsiteText(settings.website_text);
                    setWebsiteLink(settings.website_link);
                    setIosLink(settings.ios_link);
                    setAndroidLink(settings.android_link);
                    setTellFriendLink(settings.tell_a_friend_link);
                    setWebsiteEmail(settings.website_email);
                    setWebsiteColorPrimary(settings.website_color_primary || '#000000');
                    setWebsiteColorSecondary(settings.website_color_secondary || '#ffffff');
                    setCurrentLogo(settings.website_logo);
                    setCurrentFavicon(settings.website_fav_icon);
                    console.log(settings.website_fav_icon);
                    setSetting_id(settings.setting_id);
                }
            } catch (err) {
                console.error('Failed to fetch web settings:', err);
            }
        };

        fetchSettings();
    }, [setting_id, updateFlag]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedLogo(file);
            setPreviewLogo(URL.createObjectURL(file));
            setIsDirty(true);
        }
    };

    const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFavicon(file);
            setPreviewFavicon(URL.createObjectURL(file));
            setIsDirty(true);
        }
    };

    const handleRemoveLogo = () => {
        setSelectedLogo(null);
        setPreviewLogo(null);
        setCurrentLogo(null);
        if (logoInputRef.current) logoInputRef.current.value = '';
    };

    const handleRemoveFavicon = () => {
        setSelectedFavicon(null);
        setPreviewFavicon(null);
        setCurrentFavicon(null);
        if (faviconInputRef.current) faviconInputRef.current.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('website_name', websiteName);
        formData.append('website_text', websiteText);
        formData.append('website_link', websiteLink);
        formData.append('ios_link', iosLink);
        formData.append('android_link', androidLink);
        formData.append('tell_a_friend_link', tellFriendLink);
        formData.append('website_color_primary', websiteColorPrimary);
        formData.append('website_color_secondary', websiteColorSecondary);
        formData.append('website_email', websiteEmail);
        formData.append('setting_id', setting_id.toString());

        if (selectedLogo) {
            formData.append('files', selectedLogo);
        }

        try {
            const response = await postData('edit-website-setting', formData, 'multipart/form-data');
            if (response.success) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Web settings updated successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                setUpdateFlag(!updateFlag);
            }
        } catch (err) {
            console.error('Failed to update web settings:', err);
        }

        if (selectedFavicon) {
            const faviconData = new FormData();
            faviconData.append('logotype', 'FAVICON'); // Indicates the type of logo
            faviconData.append('setting_id', setting_id.toString()); // The ID for settings
            faviconData.append('files', selectedFavicon); // The favicon file
            try {
                const faviconResponse = await postData('edit-favicon', faviconData, 'multipart/form-data');
                if (faviconResponse.success) {
                    setUpdateFlag(!updateFlag);
                }
            } catch (err) {
                console.error('Failed to update favicon:', err);
            }
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
                    <span>Frontend Setting</span>
                </li>
            </ul>
            <div className="text-2xl text-dark mb-3 mt-3">Frontend Setting</div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-5">
                <div className="panel space-y-5">
                    <div>
                        <label htmlFor="websiteName" className="font-bold">Website Name</label>
                        <input
                            id="websiteName"
                            type="text"
                            value={websiteName}
                            onChange={(e) => { setWebsiteName(e.target.value); setIsDirty(true); }}
                            placeholder="Enter website name"
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-y-8 mt-5">
                        <div>
                            <label htmlFor="websiteLogo" className="font-bold">Upload Logo</label>
                            <input
                                id="websiteLogo"
                                type="file"
                                ref={logoInputRef}
                                onChange={handleLogoChange}
                                className="form-input w-full file:py-2 mt-3 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 file:text-white file:hover:bg-primary"
                                accept="image/*"
                            />
                        </div>
                        {previewLogo || currentLogo ? (
                            <div className="relative w-full sm:w-64">
                                <label className="font-bold">Logo Preview:</label>
                                <img
                                    src={previewLogo || currentLogo}
                                    alt="Logo Preview"
                                    className="mt-4 w-full rounded-md shadow-md border border-gray-200"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveLogo}
                                    className="absolute top-4 -right-2 bg-blue-600 text-white rounded-full px-2 p-0.5 text-sm"
                                    style={{ transform: 'translate(50%, -50%)' }}
                                >
                                    &times;
                                </button>
                            </div>
                        ) : null}

                        <div>
                            <label htmlFor="websiteFavicon" className="font-bold">Upload Favicon</label>
                            <input
                                id="websiteFavicon"
                                type="file"
                                ref={faviconInputRef}
                                onChange={handleFaviconChange}
                                className="form-input w-full file:py-2 mt-3 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 file:text-white file:hover:bg-primary"
                                accept="image/*"
                            />
                        </div>
                        {previewFavicon || currentFavicon ? (
                            <div className="relative w-full sm:w-64">
                                <label className="font-bold">Favicon Preview:</label>
                                <img
                                    src={previewFavicon || currentFavicon}
                                    alt="Favicon Preview"
                                    className="mt-4 w-full rounded-md shadow-md border border-gray-200"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveFavicon}
                                    className="absolute top-4 -right-2 bg-blue-600 text-white rounded-full px-2 p-0.5 text-sm"
                                    style={{ transform: 'translate(50%, -50%)' }}
                                >
                                    &times;
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>
                <button disabled={!isDirty} className="btn btn-primary" type="submit">
                    Update Settings
                </button>
            </form>
        </div>
    );
}

export default EditWebSettings;
