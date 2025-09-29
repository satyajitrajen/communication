import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import 'file-upload-with-preview/dist/style.css';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import useApiPost from '../../../hooks/PostData'; // Adjust the import path as necessary
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import axios from 'axios';

const EditProductForm = () => {
    const location = useLocation();
    const product_id = location.state?.product_id;
    const { loading, error, postData } = useApiPost();
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [previewImages, setPreviewImages] = useState<any[]>([]); // For preview
    const [fileImages, setFileImages] = useState<any[]>([]); // For files
    const [originalPrice, setOriginalPrice] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [inStockEnabled, setInStockEnabled] = useState(true);
    const [inStock, setInStock] = useState('');
    const [product, setProduct] = useState<any>(null);
    const fileInputRef = useRef(null); // Reference to the hidden file input

    const maxNumber = 69;

    useEffect(() => {
        fetchCategories();
        if (product_id) {
            fetchProduct();
        }
    }, [product_id]);

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

    const fetchProduct = async () => {
        try {
            const response = await postData('ProductById', { product_id });
            if (response.success === 'true') {
                const productData = response.isProduct;
                setProduct(productData);
                setSelectedCategory(productData.category_id);
                setOriginalPrice(productData.original_price);
                setSalePrice(productData.sale_price || '');
                setInStock(productData.in_stock || '');
                setInStockEnabled(productData.in_stock !== null);

                const initialImages: string[] = [];
                const fileImages = []
                // Add the product thumbnail first
                if (productData.product_thumbnail) {
                    const thumbnailResponse = await axios.get(productData.product_thumbnail, { responseType: 'arraybuffer' });
                    const file = new Blob([thumbnailResponse.data], { type: thumbnailResponse.headers['content-type'] });
                    const thumbnailUrl = URL.createObjectURL(file);
                    initialImages.push(thumbnailUrl);
                    fileImages.push(file); // Add the Blob to the array
                }

                // Add the other images
                await Promise.all(productData.ProductImages.map(async (img: { product_image: string; product_image_id: any; }) => {
                    console.log(productData.ProductImages);
                    if (img.product_image !== 'http://192.168.0.27:3008/undefined') {
                        const response = await axios.get(img.product_image, { responseType: 'arraybuffer' });
                        const file = new Blob([response.data], { type: response.headers['content-type'] });
                        const imageUrl = URL.createObjectURL(file);
                        console.log('Image URL:', imageUrl); // Log the URL for debugging
                        initialImages.push(imageUrl);
                        fileImages.push(file); // Add the Blob to the array
                    }
                }));

                setPreviewImages(initialImages);
                setFileImages(fileImages); // Update fileImages with Blob objects
            } else {
                console.error('Product not found');
            }
        } catch (err) {
            console.error('Error fetching product:', err);
        }
    };


    const handleCategoryChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelectedCategory(event.target.value);
    };

    const onImageUpload = () => {
        fileInputRef.current.click();
    };


    const handleFileChange = (e: { target: { files: Iterable<unknown> | ArrayLike<unknown>; }; }) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file:any) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setFileImages([...fileImages, ...newImages.map(image => image.file)]);
        setPreviewImages([...previewImages, ...newImages.map(image => image.preview)]);
        console.log("ss", fileImages, "ss");

    };

    const handleImageRemove = (index: number) => {
        const updatedPreviewImages = [...previewImages];
        const updatedFileImages = [...fileImages];
        updatedPreviewImages.splice(index, 1);
        updatedFileImages.splice(index, 1);
        setPreviewImages(updatedPreviewImages);
        setFileImages(updatedFileImages);
    };





    const handleOriginalPriceChange = (event: { target: { value: any; }; }) => {
        const value = event.target.value;
        setOriginalPrice(value);
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

        if (fileImages.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'No Image Uploaded',
                toast: true,
                timer: 3000,
                position: 'top',
            });
            return;
        }

        const formData = new FormData(event.target);
        formData.append('categorySelect', selectedCategory);
        formData.append('product_id', product_id);

        fileImages.forEach((file: File) => {
            formData.append('files', file);
        });

        try {
            const response = await postData('editProduct', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.success === "true") {
                Swal.fire({
                    icon: 'success',
                    title: 'Product updated successfully',
                    showConfirmButton: true,
                    timer: 3000,
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error updating product',
                    text: response.message,
                });
            }
        } catch (err) {
            console.error('Error submitting form:', err);
            Swal.fire({
                icon: 'error',
                title: 'Error updating product',
                text: 'An error occurred while updating the product.',
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
                    <span>Edit Product  {product_id}</span>

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
                        <input id="Product_name" name="Product_name" type="text" placeholder="Product Name" required defaultValue={product?.Product_name} className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
                    </div>
                    <div>
                        <label htmlFor="categorySelect" className="block text-sm font-medium text-gray-700">
                            Category
                            <span className="text-red-500">*</span>
                            <Tippy trigger="click" content="Select a category" placement="right">
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
                        <Tippy trigger="click" content="Enter the main description" placement="right">
                            <span className="mx-3 border-2 rounded-full px-1.5 text-[9px] border-gray-400 dark:border-gray-800">!</span>
                        </Tippy>
                    </label>
                    <textarea
                        id="Product_desc"
                        name="Product_desc"
                        placeholder="Enter Main Description"
                        required
                        defaultValue={product?.Product_desc}
                        className="form-textarea mt-1 block w-full h-32 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    />
                </div>
                <div>
                    <label htmlFor="Additional_desc" className="block text-sm font-medium text-gray-700">
                        Additional Description
                        <Tippy trigger="click" content="Enter additional description" placement="right">
                            <span className="mx-3 border-2 rounded-full px-1.5 text-[9px] border-gray-400 dark:border-gray-800">!</span>
                        </Tippy>
                    </label>
                    <textarea
                        id="Additional_desc"
                        name="Additional_desc"
                        placeholder="Enter additional Description"
                        defaultValue={product?.Additional_desc}
                        className="form-textarea mt-1 block w-full h-32 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                        <label htmlFor="original_price" className="block text-sm font-medium text-gray-700">
                            Original Price
                            <span className="text-red-500">*</span>
                            <Tippy trigger="click" content="Enter the original price" placement="right">
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
                            <Tippy trigger="click" content="Enter the sale price" placement="right">
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
                            <span>In Stock</span>
                            <Tippy trigger="click" content="Enter stock quantity" placement="right">
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
                            disabled={!inStockEnabled}
                            className={`form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${!inStockEnabled ? 'bg-gray-100 text-gray-900 cursor-not-allowed dark:text-black dark:bg-black' : ''}`}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Product Images
                        <span className="text-red-500">*</span>
                        <Tippy trigger="click" content="Upload product images" placement="right">
                            <span className="mx-3 border-2 rounded-full px-1.5 text-[9px] border-gray-400 dark:border-gray-800">!</span>
                        </Tippy>
                    </label>
                    {/* <ImageUploading
                        multiple
                        value={fileImages}
                        // onChange={onImageUploadd} // Ensure your custom function is passed here
                        maxNumber={maxNumber}
                        dataURLKey="data_url"
                    >
                        {({ imageList, onImageUpload, onImageRemove }) => (
                            <>
                                <button
                                    type="button"
                                    onClick={onImageUpload} // This will trigger the file input dialog
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                >
                                    Upload Images
                                </button>
                                <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 mt-4">
                                    {previewImages.map((image, index) => (
                                        <div key={index} className="relative">
                                            <button
                                                type="button"
                                                className="absolute top-2 right-2 bg-blue-600 text-gray-200 rounded-full p-1 px-2 text-xs"
                                                title="Clear Image"
                                                onClick={() => {
                                                    onImageRemove(index); // Call ImageUploading's remove function
                                                    handleImageRemove(index); // Ensure local state is updated
                                                }}
                                            >
                                                ×
                                            </button>
                                            <img
                                                src={image}
                                                alt="Preview"
                                                className="w-52 h- object-cover rounded-lg shadow-md"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </ImageUploading> */}
                    <input
                        type="file"
                        id="files"
                        name="files"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        ref={fileInputRef} // Ref to the file input
                    />
                    <button
                        type="button"
                        onClick={onImageUpload} // This will trigger the file input dialog
                        className="px-4 py-2 bg-blue-500 text-white rounded-md mt-1"
                    >
                        Upload Images
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 mt-4">
                        {previewImages.length === 0 ? (
                            <div className="flex justify-center items-center col-span-full">
                                <img src="/assets/images/file-preview.svg" className="max-w-md w-1/3 mx-auto mt-4" alt="File Preview" />
                            </div>
                        ) : (
                            previewImages.map((image, index) => (
                                <div key={index} className="relative">
                                    <button
                                        type="button"
                                        className="absolute top-2 right-2 bg-blue-600 text-gray-200 rounded-full p-1 text-xs"
                                        onClick={() => handleImageRemove(index)}
                                    >
                                        ×
                                    </button>
                                    <img
                                        src={image}
                                        alt={`Preview ${index}`}
                                        className="w-52 object-cover rounded-lg shadow-md"
                                    />
                                </div>
                            ))
                        )}
                    </div>



                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-md"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default EditProductForm;
