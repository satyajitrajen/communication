import React, { useState, useEffect } from 'react';
import useApiPost from '../../hooks/PostData'; // Adjust the path as necessary
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

function EditWallpaper({ wallpaper_id }) {
    const [wallpaperTitle, setWallpaperTitle] = useState('');
    const [wallpaperStatus, setWallpaperStatus] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [initialWallpaper, setInitialWallpaper] = useState(null);
    const [hasChanges, setHasChanges] = useState(false); // Track if there are changes
    const { loading, error, postData } = useApiPost();

    useEffect(() => {
        // Fetch the wallpaper details when the component mounts
        const fetchWallpaper = async () => {
            try {
                // Using POST request to get the wallpaper details
                const response = await postData('get-wallpaper-from-id', { wallpaper_id }, 'application/json');
                console.log(response);

                if (response && response.wallpaper) {
                    setWallpaperTitle(response.wallpaper.wallpaper_title);
                    setWallpaperStatus(response.wallpaper.wallpaper_status);
                    setPreviewImage(response.wallpaper.wallpaper_image);
                    setInitialWallpaper({
                        wallpaperTitle: response.wallpaper.wallpaper_title,
                        wallpaperStatus: response.wallpaper.wallpaper_status,
                        wallpaperImage: response.wallpaper.wallpaper_image
                    });
                }
            } catch (err) {
                console.error('Failed to fetch wallpaper:', err);
            }
        };

        fetchWallpaper();
    }, [wallpaper_id]);

    const handleImageChange = (e) => {
        const files = e.target.files[0];
        if (files) {
            setSelectedImage(files);
            setPreviewImage(URL.createObjectURL(files));
            setHasChanges(true);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setPreviewImage(null);
        document.getElementById('wallpaperImage').value = null;
        setHasChanges(true);
    };

    const handleInputChange = (e) => {
        const { id, value, type, checked } = e.target;
        if (type === 'text') {
            setWallpaperTitle(value);
        } else if (type === 'checkbox') {
            setWallpaperStatus(checked);
        }
        setHasChanges(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!hasChanges) {
            // If no changes, do not submit
            return;
        }

        const formData = new FormData();
        formData.append('wallpaper_title', wallpaperTitle);
        formData.append('wallpaper_status', wallpaperStatus);
        formData.append('wallpaper_id', wallpaper_id);
        if (selectedImage) {
            formData.append('files', selectedImage);
        }

        try {
            const response = await postData(`edit-wallpaper`, formData, 'multipart/form-data');
            if (response.success) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Wallpaper updated successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                // Optionally perform other actions here, like redirecting to the wallpaper list
            }
        } catch (err) {
            console.error('Failed to update wallpaper:', err);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">Failed to load wallpaper. Please try again.</p>;

    return (
        <div className="mt-6">
            <ul className="flex space-x-2 rtl:space-x-reverse text-sm text-gray-700">
                <li>
                    <Link to="#" className="text-blue-500 hover:underline">
                        Wallpaper Settings
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
                    <span>Wallpaper List</span>
                </li>
            </ul>
            <form onSubmit={handleSubmit} className="mt-6 space-y-5 panel">
                <div>
                    <label htmlFor="wallpaperTitle">Wallpaper Title</label>
                    <input
                        id="wallpaperTitle"
                        type="text"
                        value={wallpaperTitle}
                        onChange={handleInputChange}
                        placeholder="Enter wallpaper title"
                        className="form-input"
                        required
                    />
                </div>
                

                <div>
                    <label htmlFor="wallpaperImage">Upload Wallpaper</label>
                    <input
                        id="wallpaperImage"
                        type="file"
                        onChange={handleImageChange}
                        className="form-input file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 ltr:file:mr-5 rtl:file-ml-5 file:text-white file:hover:bg-primary"
                        accept="image/*"
                    />
                </div>
                {previewImage && (
                    <div className="relative">
                        <label>Preview:</label>
                        <img src={previewImage} alt="Wallpaper Preview" className="mt-4 w-64 rounded-md" />
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-5 left-64 bg-blue-600 text-white rounded-full px-1 text-xs transform translate-x-1/2 -translate-y-1/2"
                        >
                            &times;
                        </button>
                    </div>
                )}
                <div>
                    <label>Wallpaper Status</label>
                    <div
                        onClick={() => {
                            setWallpaperStatus(!wallpaperStatus);
                            setHasChanges(true);
                        }}
                        className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${wallpaperStatus ? 'bg-blue-500' : 'bg-gray-300'}`}
                    >
                        <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${wallpaperStatus ? 'translate-x-4' : 'translate-x-0'}`}
                        />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary !mt-6" disabled={!hasChanges}>
                    Submit
                </button>
            </form>
        </div>
    );
}

export default EditWallpaper;
