import React, { useState } from 'react';
import useApiPost from '../../hooks/PostData'; // Adjust the path as necessary
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function AddNewAvatar() {
    const [avatarName, setAvatarName] = useState('');
    const [avatarGender, setAvatarGender] = useState('Male'); // Default value
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const { loading, error, data, postData } = useApiPost(); // Destructure the hook

    const handleImageChange = (e) => {
        const files = e.target.files[0];
        if (files) {
            setSelectedImage(files);
            setPreviewImage(URL.createObjectURL(files));
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setPreviewImage(null);
        // Reset the file input value
        document.getElementById('avatarMedia').value = null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
     
        const formData = new FormData();
        formData.append('avatar_name', avatarName);
        formData.append('avatar_gender', avatarGender); // Add gender to formData
        if (selectedImage) {
            formData.append('files', selectedImage); // Ensure the image is appended correctly as a file
        }

        try {
            const response = await postData('add-avtar', formData, 'multipart/form-data');
            if (response.success) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Avatar added successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                // Optionally reset the form or perform other actions here
                setAvatarName('');
                setAvatarGender('Male'); // Reset gender to default
                handleRemoveImage(); // Remove the image preview after submission
            }
        } catch (err) {
            console.error('Failed to add avatar:', err);
        }
    };

    return (
      <div className="mt-6">
        <ul className="flex space-x-2 rtl:space-x-reverse text-sm text-gray-700">
          <li>
            <Link to="#" className="text-blue-500 hover:underline">
              Avatar Settings
            </Link>
          </li>
          <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
            <span>Add Avatar</span>
          </li>
        </ul>
        <div className="text-2xl text-dark mb-3 mt-3">Add Avatar</div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5 panel">
          <div>
            <label htmlFor="avatarName">
              Avatar Name <span className="text-red-500">*</span>
            </label>
            <input id="avatarName" type="text" value={avatarName} onChange={(e) => setAvatarName(e.target.value)} placeholder="Enter avatar name" className="form-input" required />
          </div>

          <div>
            <label htmlFor="avatarMedia">
              Upload Avatar <span className="text-red-500">*</span>
            </label>
            <input
              id="avatarMedia"
              type="file"
              onChange={handleImageChange}
              className="form-input file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 ltr:file:mr-5 rtl:file-ml-5 file:text-white file:hover:bg-primary"
              accept="image/*"
              required
            />
          </div>
          {previewImage && (
            <div className="relative">
              <label>Preview:</label>
              <img src={previewImage} alt="Avatar Preview" className="mt-4 w-64 rounded-md" />
              <button type="button" onClick={handleRemoveImage} className="absolute top-5 left-64 bg-blue-600 text-white rounded-full px-1 text-xs transform translate-x-1/2 -translate-y-1/2">
                &times;
              </button>
            </div>
          )}
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">Failed to add avatar. Please try again.</p>}
          <div className="flex gap-x-6 justify-start">
            <div className="">
              <label htmlFor="avatarGender">
                Gender <span className="text-red-500">*</span>
              </label>
              <select id="avatarGender" value={avatarGender} onChange={(e) => setAvatarGender(e.target.value)} className="form-select text-white-dark" required>
                <option className="selection:bg-primary" value="Male">
                  Male
                </option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary !mt-6">
            Submit
          </button>
        </form>
      </div>
    );
}

export default AddNewAvatar;
