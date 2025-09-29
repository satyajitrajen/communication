import React, { useState, useEffect } from 'react';
import useApiPost from '../../hooks/PostData'; // Adjust the path as necessary
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import toast from 'react-hot-toast';

function EditAvatar({ avatar_id }) {
    const [avatarName, setAvatarName] = useState('');
    const [avatarGender, setAvatarGender] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [initialAvatar, setInitialAvatar] = useState(null);
    const [hasChanges, setHasChanges] = useState(false); // Track if there are changes
    const { loading, error, postData } = useApiPost();
    
    useEffect(() => {
        // Fetch the avatar details when the component mounts
        const fetchAvatar = async () => {
            try {
                const response = await postData('get-avtar-from-id', { avatar_id }, 'application/json');

                if (response && response.avtar) {
                    setAvatarName(response.avtar.avatar_name);
                    setAvatarGender(response.avtar.avatar_gender);
                    setPreviewImage(response.avtar.avtar_Media);
                    
                    setInitialAvatar({
                        avatarName: response.avtar.avatar_name,
                        avatarGender: response.avtar.avatar_gender,
                        avatarMedia: response.avtar.avatar_Media,
                    });
                    
                }
            } catch (err) {
                console.error('Failed to fetch avatar:', err);
            }
        };

        fetchAvatar();
    }, [avatar_id]);

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
        document.getElementById('avatarMedia').value = null;
        setHasChanges(false);
    };

    const handleInputChange = (e) => {
        const { id, value, type, checked } = e.target;
        if (type === 'text') {
            setAvatarName(value);
        } else if (type === 'checkbox') {
        } else if (id === 'avatarGender') {
            setAvatarGender(value);
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
        formData.append('avatar_name', avatarName);
        formData.append('avatar_gender', avatarGender);
        formData.append('avatar_id', avatar_id);
        if (selectedImage) {
            formData.append('files', selectedImage);
        }

        try {
            const response = await postData(`edit-avatar`, formData, 'multipart/form-data');
            if (response.success) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Avatar updated successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                // Optionally perform other actions here, like redirecting to the avatar list
            }
        } catch (err) {
            console.error('Failed to update avatar:', err);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">Failed to load avatar. Please try again.</p>;

    return (
        <div className="mt-6">
            <ul className="flex space-x-2 rtl:space-x-reverse text-sm text-gray-700">
                <li>
                    <Link to="#" className="text-blue-500 hover:underline">
                        Avatar Settings
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
                    <span>Avatar List</span>
                </li>
            </ul>
            <form onSubmit={handleSubmit} className="mt-6 space-y-5 panel">
                <div>
                    <label htmlFor="avatarName">Avatar Name</label>
                    <input
                        id="avatarName"
                        type="text"
                        value={avatarName}
                        onChange={handleInputChange}
                        placeholder="Enter avatar name"
                        className="form-input"
                        required
                    />
                </div>
                
                <div>
                    <label htmlFor="avatarGender">Avatar Gender</label>
                    <select
                        id="avatarGender"
                        value={avatarGender}
                        onChange={handleInputChange}
                        className="form-select"
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="avatarMedia">Upload Avatar</label>
                    <input
                        id="avatarMedia"
                        type="file"
                        onChange={handleImageChange}
                        className="form-input file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 ltr:file:mr-5 rtl:file-ml-5 file:text-white file:hover:bg-primary"
                        accept="image/*"
                    />
                </div>
                {previewImage && (
                    <div className="relative">
                        <label>Preview:</label>
                        <img src={previewImage} alt="Avatar Preview" className="mt-4 w-64 rounded-md" />
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-5 left-64 bg-blue-600 text-white rounded-full px-1 text-xs transform translate-x-1/2 -translate-y-1/2"
                        >
                            &times;
                        </button>
                    </div>
                )}
                
                <button type="submit" className="btn btn-primary !mt-6" disabled={!hasChanges}>
                    Submit
                </button>
            </form>
        </div>
    );
}

export default EditAvatar;
