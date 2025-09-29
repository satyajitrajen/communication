import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useApiPost from '../../../hooks/PostData'; // Adjust the import path as necessary

const ViewProductById = () => {
    const location = useLocation();
    const product_id = location.state?.product_id;
    const { loading, error, postData } = useApiPost();
    const [product, setProduct] = useState<any>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (product_id) {
                try {
                    const response = await postData('ProductById', { product_id });
                    if (response.success === 'true') {
                        setProduct(response.isProduct);
                    } else {
                        console.error('Product not found');
                    }
                } catch (err) {
                    console.error('Error fetching product:', err);
                }
            }
        };

        fetchProduct();
    }, [product_id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading product</div>;

    return (
        <div className='p-4'>
            <ul className="flex space-x-2 rtl:space-x-reverse text-sm text-gray-700">
                <li>
                    <Link to="#" className="text-blue-500 hover:underline">
                        Products
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
                    <span>Product {product_id}</span>
                </li>
            </ul>
            <div className="container mx-auto p-6 flex flex-col md:flex-row">
                {/* Product Image */}
                <div className="w-full md:w-1/2 mb-6 md:mb-0">
                    <img
                        src={product?.product_thumbnail}
                        alt={product?.Product_name}
                        className="w-1/2 h-auto object-cover rounded-lg shadow-lg"
                    />
                </div>
                {/* Product Details */}
                <div className="w-full md:w-1/2 md:pl-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{product?.Product_name}</h1>
                    <p className="text-lg text-gray-700 mb-4">{product?.Product_desc}</p>
                    <p className="text-lg text-gray-600 mb-4">{product?.Additional_desc}</p>
                    <div className="flex items-center mb-4">
                        <span className="text-xl font-semibold text-gray-900">${product?.original_price}</span>
                        {product?.sale_price && (
                            <span className="text-xl font-semibold text-red-600 ml-4">${product?.sale_price}</span>
                        )}
                    </div>
                    <div className="mb-6">
                        <p className="text-lg text-gray-800 mb-2">
                            <span className="font-semibold">In Stock:</span> {product?.in_stock}
                        </p>
                    </div>
                    <button className="bg-yellow-500 text-white px-6 py-3 rounded-md mt-4">
                        Add to Cart
                    </button>
                    <button className="bg-blue-500 text-white px-6 py-3 rounded-md mt-4 ml-4">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewProductById;
