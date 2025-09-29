import React, { useState } from 'react';
import useApiPost from '../../hooks/PostData'; // Adjust the path as necessary
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function AddNewWallpaper() {
    const [wallpaperTitle, setWallpaperTitle] = useState('');
    const [wallpaperStatus, setWallpaperStatus] = useState(true);
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
        document.getElementById('wallpaperImage').value = null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const formData = new FormData();
        formData.append('wallpaper_title', wallpaperTitle);
        formData.append('wallpaper_status', wallpaperStatus);
        if (selectedImage) {
            formData.append('files', selectedImage); // Make sure the image is appended correctly as a file
        }

        try {
            const response = await postData('add-wallpaper', formData, 'multipart/form-data');
            if (response.success) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Wallpaper added successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                // Optionally reset the form or perform other actions here
                setWallpaperTitle('');
                setWallpaperStatus(true);
                handleRemoveImage(); // Remove the image preview after submission
            }
        } catch (err) {
            console.error('Failed to add wallpaper:', err);
        }
    };

    return (
      <div className="mt-6">
        <ul className="flex space-x-2 rtl:space-x-reverse text-sm text-gray-700">
          <li>
            <Link to="#" className="text-blue-500 hover:underline">
              Wallpaper Settings
            </Link>
          </li>
          <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
            <span>Add Wallpaper</span>
          </li>
        </ul>
        <div className="text-2xl text-dark mb-3 mt-3">Add Wallpaper</div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5 panel">
          <div>
            <label htmlFor="wallpaperTitle">
              Wallpaper Title <span className="text-red-500">*</span>
            </label>
            <input id="wallpaperTitle" type="text" value={wallpaperTitle} onChange={(e) => setWallpaperTitle(e.target.value)} placeholder="Enter wallpaper title" className="form-input" required />
          </div>

          <div>
            <label htmlFor="wallpaperImage">
              Upload Wallpaper <span className="text-red-500">*</span>
            </label>
            <input
              id="wallpaperImage"
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
              <img src={previewImage} alt="Wallpaper Preview" className="mt-4 w-64 rounded-md" />
              <button type="button" onClick={handleRemoveImage} className="absolute top-5 left-64 bg-blue-600 text-white rounded-full px-1 text-xs transform translate-x-1/2 -translate-y-1/2">
                &times;
              </button>
            </div>
          )}
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">Failed to add wallpaper. Please try again.</p>}
          <div>
            <label>Wallpaper Status</label>
            <div
              onClick={() => setWallpaperStatus(!wallpaperStatus)}
              className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${wallpaperStatus ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${wallpaperStatus ? 'translate-x-4' : ''}`} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary !mt-6">
            Submit
          </button>
        </form>
      </div>
    );
}

export default AddNewWallpaper;
