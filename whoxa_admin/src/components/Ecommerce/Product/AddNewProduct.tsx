import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import 'file-upload-with-preview/dist/style.css';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import useApiPost from '../../../hooks/PostData'; // Adjust the import path as necessary
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import AddVariantForm from '../ProductVarient/AddNewVarient';

const AddProductForm = () => {
  const { loading, error, data, postData } = useApiPost();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [images2, setImages2] = useState<any>([]);
  const [originalPrice, setOriginalPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [inStockEnabled, setInStockEnabled] = useState(true); // State for toggle button
  const [inStock, setInStock] = useState(''); // State for "In Stock" field
  const maxNumber = 69;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await postData('search-category-for-add-product', {});
      if (response.success === 'true') {
        setCategories(response.isCategory);
        setFilteredCategories(response.isCategory);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleCategoryChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSelectedCategory(event.target.value);
  };

  const onChange2 = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
    setImages2(imageList as never[]);
  };

  const handleOriginalPriceChange = (event: { target: { value: any; }; }) => {
    const value = event.target.value;
    setOriginalPrice(value);
    // setSalePrice(value); // Automatically set sale price to original price
  };

  const handleSalePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSalePrice = event.target.value;

    if (parseFloat(newSalePrice) > parseFloat(originalPrice)) {
      setSalePrice(originalPrice); // Set sale price to original price
      Swal.fire({
        icon: 'warning',
        title: 'Sale Price is Greater than Original Price',
        text: 'Sale price has been set to the original price.',
        showConfirmButton: true,
      });
    } else {
      setSalePrice(newSalePrice);
    }
  };


  const handleToggleInStock = () => {
    setInStockEnabled(!inStockEnabled);
    if (!inStockEnabled) {
      setInStock(''); // Clear the inStock value if toggled off
    }
  };

  const handleInStockChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setInStock(event.target.value);
  };

  const handleSubmit = async (event: { preventDefault: () => void; target: HTMLFormElement | undefined; }) => {
    event.preventDefault();

    // Check if at least one image is uploaded
    if (images2.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'No Image Uploaded',
        toast: true,
        timer: 3000,
        position: 'top',
      });
      return; // Prevent form submission
    }

    const formData = new FormData(event.target);
    formData.append('categorySelect', selectedCategory);

    images2.forEach((image: { file: string | Blob; }) => {
      formData.append('files', image.file);
    });

    try {
      const response = await postData('addProduct', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.success === "true") {
        Swal.fire({
          icon: 'success',
          title: 'Form submitted successfully',
          showConfirmButton: true,
          timer: 3000,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error submitting form',
          text: response.message,
        });
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error submitting form',
        text: 'An error occurred while submitting the form.',
      });
    }
  };

  return (
    <div className='p-4'>
      <ul className="flex space-x-2 rtl:space-x-reverse text-sm text-gray-700 mb-7">
        <li>
          <Link to="#" className="text-blue-500 hover:underline">
            Products
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
          <span>Add New Product</span>
        </li>
      </ul>
      <form className="space-y-5" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="Product_name" className="block text-sm font-medium text-gray-700">
              Product Name <span className="text-red-500">*</span>
              <Tippy trigger="click" content="Enter the product name" placement="right">
                <span className="mx-3 border-2 rounded-full px-1.5 text-[9px] border-gray-400 dark:border-gray-800">!</span>
              </Tippy>
            </label>
            <input id="Product_name" name="Product_name" type="text" placeholder="Product Name" required className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
          </div>
          <div>
            <label htmlFor="categorySelect" className="block text-sm font-medium text-gray-700">
              Category
              <span className="text-red-500">*</span>
              <Tippy trigger="click" content="Enter the product name" placement="right">
                <span className="mx-3 border-2 rounded-full px-1.5 text-[9px] border-gray-400 dark:border-gray-800">!</span>
              </Tippy>
            </label>
            <select
              id="categorySelect"
              name="categorySelect"
              value={selectedCategory}
              onChange={handleCategoryChange}
              required
              className="form-select mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            >
              <option value="">Select a category</option>
              {filteredCategories.map(category => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="Product_desc" className="block text-sm font-medium text-gray-700">
            Product Description
            <span className="text-red-500">*</span>
            <Tippy trigger="click" content="Enter the product name" placement="right">
              <span className="mx-3 border-2 rounded-full px-1.5 text-[9px] border-gray-400 dark:border-gray-800">!</span>
            </Tippy>
          </label>
          <textarea
            id="Product_desc"
            name="Product_desc"
            placeholder="Enter Main Description"
            required
            className="form-textarea mt-1 block w-full h-32 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="Additional_desc" className="block text-sm font-medium text-gray-700">
            Additional Description
            <Tippy trigger="click" content="Enter the product name" placement="right">
              <span className="mx-3 border-2 rounded-full px-1.5 text-[9px] border-gray-400 dark:border-gray-800">!</span>
            </Tippy>
          </label>
          <textarea
            id="Additional_desc"
            name="Additional_desc"
            placeholder="Enter additional Description"
            className="form-textarea mt-1 block w-full h-32 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label htmlFor="original_price" className="block text-sm font-medium text-gray-700">
              Original Price
              <span className="text-red-500">*</span>
              <Tippy trigger="click" content="Enter the product name" placement="right">
                <span className="mx-3 border-2 rounded-full px-1.5 text-[9px] border-gray-400 dark:border-gray-800">!</span>
              </Tippy>
            </label>
            <input
              id="original_price"
              name="original_price"
              type="number"
              placeholder="Original Price"
              required
              value={originalPrice}
              onChange={handleOriginalPriceChange}
              className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div className="md:col-span-1">
            <label htmlFor="sale_price" className="block text-sm font-medium text-gray-700">
              Sale Price
              <Tippy trigger="click" content="Enter the product name" placement="right">
                <span className="mx-1 border-2 rounded-full px-1.5 text-[9px] border-gray-400 dark:border-gray-800">!</span>
              </Tippy>
            </label>
            <input
              id="sale_price"
              name="sale_price"
              type="number"
              value={salePrice}
              placeholder="Sale Price"
              onChange={handleSalePriceChange}
              className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div className="md:col-span-1">
            <label htmlFor="in_stock" className="flex items-center text-sm font-medium text-gray-700">
              <span className="">In Stock</span>
              <Tippy trigger="click" content="Enter the product name" placement="right">
                <span className="mx-2 border-2 rounded-full px-2 text-xs border-gray-400 dark:border-gray-800 flex items-center justify-center w-5 h-5">!</span>
              </Tippy>
              <div className="relative flex items-center ml-auto">
                <input
                  type="checkbox"
                  id="in_stock"
                  className="sr-only"
                  checked={inStockEnabled}
                  onChange={handleToggleInStock}
                />
                <div className={`w-10 h-6 rounded-full shadow-inner ${inStockEnabled ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform ${inStockEnabled ? 'translate-x-4' : 'translate-x-0'}`}
                ></div>
              </div>
            </label>

            <input
              id="in_stock"
              name="in_stock"
              type="number"
              placeholder="In Stock"
              required
              value={inStock}
              onChange={handleInStockChange}
              disabled={!inStockEnabled} // Enable/disable input based on toggle
              className={`form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${!inStockEnabled ? 'bg-gray-100 text-gray-900 cursor-not-allowed dark:text-black dark:bg-black' : ''}`}
            />

          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Images
            <span className="text-red-500">*</span>
            <Tippy trigger="click" content="Enter the product name" placement="right">
              <span className="mx-3 border-2 rounded-full px-1.5 text-[9px] border-gray-400 dark:border-gray-800">!</span>
            </Tippy>
          </label>
          <ImageUploading multiple value={images2} onChange={onChange2} maxNumber={maxNumber}>
            {({ imageList, onImageUpload, onImageRemove }) => (
              <div>
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
                  onClick={(e) => {
                    e.preventDefault();
                    onImageUpload();
                  }}
                >
                  Choose File...
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 mt-4">
                  {imageList.map((image, index) => (
                    <div key={index} className="relative">
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-blue-600 text-gray-200 rounded-full p-1 px-2 text-xs"
                        title="Clear Image"
                        onClick={() => onImageRemove(index)}
                      >
                        ×
                      </button>
                      <img
                        src={image.dataURL}
                        alt="Preview"
                        className="w-52 h- object-cover rounded-lg shadow-md"
                      />
                    </div>
                  ))}
                </div>


              </div>
            )}
          </ImageUploading>
          {images2.length === 0 && (

            <img src="/assets/images/file-preview.svg" className="max-w-md w-1/3 mx-auto mt-4" alt="File Preview" />
          )}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
      {/* <AddVariantForm productId={undefined}/> */}
    </div>
  );
};

export default AddProductForm;
